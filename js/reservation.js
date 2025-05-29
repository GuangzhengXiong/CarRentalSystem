// js/reservation.js

$(document).ready(function() {
  const vin = localStorage.getItem('lastVin');
  const savedData = JSON.parse(localStorage.getItem('reservationData') || '{}');

  const $noSelect = $('#no-selection-msg').hide();
  const $unavail  = $('#unavailable-msg').hide();
  const $details  = $('#car-details').hide();
  const $form     = $('#reservation-form').hide();
  const $submit   = $('#submit-btn');

  const fields = ['name','phone','email','license_number','start_date','rental_days'];
  const touched    = {};
  const validState = {};

  function validateField(name) {
    const val = $(`#${name}`).val().trim();
    let valid = false, err = '';

    switch (name) {
      case 'name':
        valid = val.length >= 2; err = 'Name must be at least 2 characters'; break;
      case 'phone':
        valid = /^\+?\d{7,15}$/.test(val); err = 'Invalid phone number'; break;
      case 'email':
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); err = 'Invalid email address'; break;
      case 'license_number':
        valid = val.length >= 5; err = 'License number must be at least 5 characters'; break;
      case 'start_date':
        valid = val !== ''; err = 'Please select a start date'; break;
      case 'rental_days':
        valid = /^\d+$/.test(val) && parseInt(val,10)>=1; err = 'Please enter a positive integer'; break;
    }

    validState[name] = valid;
    const $err = $(`#${name}-error`);

    if (touched[name]) {
      if (valid) {
        $err.text('✔').addClass('success').removeClass('invalid');
      } else {
        $err.text(`✖ ${err}`).removeClass('success');
      }
    } else {
      $err.text('');
    }
  }

  function toggleSubmit() {
    const ok = fields.every(f => validState[f]);
    $submit.prop('disabled', !ok);
  }

  fields.forEach(name => {
    touched[name] = Boolean(savedData[name]);
    if (savedData[name]) $(`#${name}`).val(savedData[name]);
    validState[name] = false;
    validateField(name);

    $(`#${name}`).on('input change', function() {
      const data = JSON.parse(localStorage.getItem('reservationData')||'{}');
      data[name] = $(this).val();
      localStorage.setItem('reservationData', JSON.stringify(data));
      validateField(name);
      toggleSubmit();
    });

    $(`#${name}`).on('blur', function() {
      touched[name] = true;
      validateField(name);
      toggleSubmit();
    });
  });

  if (!vin) {
    $noSelect.show();
    return;
  }

  $.ajax({
    url: 'php/load_cars.php',
    data: { vin },
    dataType: 'json',
    success(data) {
      if (!data.length) {
        $noSelect.text('Vehicle not found.').show(); return;
      }
      const car = data[0];

      // store pricePerDay for later total calculation
      window.pricePerDay = parseFloat(car.price_per_day);

      $('#car-image').attr('src',`img/${car.image_path}`).attr('alt',`${car.brand} ${car.model}`);
      $('#car-title').text(`${car.brand} ${car.model}`);
      $('#car-type').text(`Type: ${car.type}`);
      $('#car-year').text(`Year: ${car.year}`);
      $('#car-mileage').text(`Mileage: ${car.mileage} km`);
      $('#car-fuel').text(`Fuel: ${car.fuel_type}`);
      $('#car-price').text(`Price per day: $${car.price_per_day}`);
      $('#car-description').text(`Description: ${car.description}`);

      $details.show();
      if (car.available == 0) {
        $unavail.show();
      } else {
        // show the estimated total area
        $('#estimated-total').show();

        // update total when rental_days changes
        $('#rental_days').on('input change', function() {
          const days = parseInt($(this).val(), 10) || 0;
          const total = window.pricePerDay * days;
          $('#total-price-display').text(`$${total.toFixed(2)}`);
          // save total_price into reservationData
          const d = JSON.parse(localStorage.getItem('reservationData')||'{}');
          d.total_price = total.toFixed(2);
          localStorage.setItem('reservationData', JSON.stringify(d));
        })
        // trigger once if saved
        $('#rental_days').trigger('change');

        $form.show();
        toggleSubmit();
      }
    },
    error() {
      alert('Failed to load car details.');
    }
  });

  $form.on('submit', function(e) {
    e.preventDefault();
    if (!fields.every(f=>validState[f])) return;
    const data = $(this).serialize() + '&vin='+encodeURIComponent(vin);
    $.post('php/submit_order.php', data, function(resp) {
      if (resp.success) {
        window.location.href = `confirmation.html?status=ok&order_id=${resp.order_id}`;
      } else {
        window.location.href = 'confirmation.html?status=fail';
      }
    },'json').fail(function() {
      window.location.href = 'confirmation.html?status=fail';
    });
  });

  $('#cancel-btn').on('click', function() {
    localStorage.removeItem('reservationData');
    $form[0].reset();
    fields.forEach(n=>{ touched[n]=false; validateField(n); });
    toggleSubmit();
    window.location.href='index.html';
  });
});
