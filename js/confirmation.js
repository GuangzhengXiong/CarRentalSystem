// js/confirmation.js

document.addEventListener('DOMContentLoaded', () => {
  const params  = new URLSearchParams(location.search);
  const status  = params.get('status');
  const orderId = params.get('order_id');

  const failMsg      = document.getElementById('fail-msg');
  const successBlock = document.getElementById('success-block');
  const confirmArea  = document.getElementById('confirm-area');
  const confirmBtn   = document.getElementById('confirm-btn');
  const confirmMsg   = document.getElementById('confirm-msg');

  // Read saved VIN and form data
  const vin      = localStorage.getItem('lastVin');
  const formData = JSON.parse(localStorage.getItem('reservationData') || '{}');

  if (status === 'ok' && orderId && vin) {
    failMsg.style.display      = 'none';
    successBlock.style.display = '';
    confirmArea.style.display  = '';

    document.getElementById('conf-period').textContent = `${formData.rental_days} days`;
    document.getElementById('conf-name').textContent   = formData.name;
    document.getElementById('conf-start').textContent  = formData.start_date;

    // fill total price
    document.getElementById('conf-total').textContent =
      `$${parseFloat(formData.total_price || 0).toFixed(2)}`;

    // fetch car details by VIN
    fetch(`php/load_cars.php?vin=${encodeURIComponent(vin)}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length) {
          const car = data[0];
          document.getElementById('conf-car').textContent = `${car.brand} ${car.model}`;
        } else {
          document.getElementById('conf-car').textContent = 'Unknown vehicle';
        }
      })
      .catch(() => {
        document.getElementById('conf-car').textContent = 'Error loading vehicle';
      });

  } else {
    failMsg.style.display      = '';
    successBlock.style.display = 'none';
    confirmArea.style.display  = 'none';
    return;
  }

  // Handle final confirm click
  confirmBtn.addEventListener('click', () => {
    confirmBtn.disabled    = true;
    confirmMsg.textContent = 'Confirming...';

    fetch(`php/confirm_order.php?order_id=${orderId}`)
      .then(r => r.json())
      .then(resp => {
        if (resp.success) {
          confirmMsg.textContent = 'Order confirmed! Thank you.';
          localStorage.removeItem('reservationData');
          localStorage.removeItem('lastVin');
        } else {
          confirmMsg.textContent = `Error: ${resp.error || 'Could not confirm.'}`;
          confirmBtn.disabled = false;
        }
      })
      .catch(() => {
        confirmMsg.textContent = 'Network error. Please try again.';
        confirmBtn.disabled = false;
      });
  });
});
