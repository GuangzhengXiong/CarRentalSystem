// js/main.js

$(document).ready(function() {
  // Hide filter dropdown on initial load
  $('#filter-dropdown').hide();

  // Store all cars for filtering, suggestions, and rendering
  let allCars = [];

  // 1) Fetch all car data on page load
  $.ajax({
    url: 'php/load_cars.php',
    dataType: 'json',
    success: function(data) {
      allCars = data;
      renderCarGrid(allCars);
    },
    error: function() {
      console.error('Failed to load car data');
    }
  });

  // 2) Trigger search when Enter is pressed in the search input
  $('#search-input').keypress(function(e) {
    if (e.which === 13) {            // 13 = Enter key
      e.preventDefault();
      applyFilterAndSearch();
    }
  });

  // 3) Real-time suggestion logic (multi-word matching including description)
  $('#search-input').on('input', function() {
    const raw = $(this).val().trim().toLowerCase();
    const $sugg = $('#suggestions').empty();

    if (!raw) {
      $sugg.hide();
      return;
    }

    const tokens = raw.split(/\s+/);
    const suggestions = new Set();

    function matchTokens(candidate) {
      return tokens.every(token => candidate.includes(token));
    }

    allCars.forEach(car => {
      const brand = car.brand.toLowerCase();
      const model = car.model.toLowerCase();
      const type  = (car.type || '').toLowerCase();
      const desc  = (car.description || '').toLowerCase();
      const combo = (car.brand + ' ' + car.model).toLowerCase();

      if (matchTokens(brand))     suggestions.add(car.brand);
      if (matchTokens(model))     suggestions.add(car.model);
      if (matchTokens(type))      suggestions.add(car.type);
      if (matchTokens(combo))     suggestions.add(car.brand + ' ' + car.model);
      if (matchTokens(desc))      suggestions.add(car.description);
    });

    if (suggestions.size === 0) {
      $sugg.append('<li class="disabled">No matching options</li>');
    } else {
      Array.from(suggestions).slice(0, 5).forEach(text => {
        $sugg.append('<li>' + text + '</li>');
      });
    }

    $sugg.show();
  });

  // 4) Hide suggestions when clicking outside of the search area
  $(document).click(function(e) {
    if (!$(e.target).closest('.search-filter').length) {
      $('#suggestions').hide();
    }
  });

  // 5) Click on a suggestion: fill input and perform search
  $('#suggestions').on('click', 'li', function() {
    if ($(this).hasClass('disabled')) return;
    $('#search-input').val($(this).text());
    $('#suggestions').hide();
    applyFilterAndSearch();
  });

  // 6) Toggle filter dropdown when the button is clicked
  $('#filter-btn').click(function(e) {
    e.stopPropagation();
    $('#filter-dropdown').toggle();
  });
  // Hide dropdown when clicking outside
  $(document).click(() => $('#filter-dropdown').hide());
  $('#filter-dropdown').click(e => e.stopPropagation());

  // 7) Apply and Clear filter actions
  $('#apply-filters-btn').click(applyFilterAndSearch);
  $('#clear-filters-btn').click(function() {
    $('.filter-type, .filter-brand').prop('checked', false);
  });

  // 8) Search button click handler
  $('#search-btn').click(applyFilterAndSearch);

  // 9) Intercept Rent button clicks: save VIN, then navigate
  $(document).on('click', '.rent-btn[data-vin]', function(e) {
    e.preventDefault();                           // prevent default link behavior
    const vin = $(this).data('vin');
    localStorage.setItem('lastVin', vin);         // store last clicked VIN
    window.location.href = 'reservation.html';     // manual navigation
  });

  /**
   * Filter cars by keyword tokens, selected types and brands, then re-render grid.
   */
  function applyFilterAndSearch() {
    const raw = $('#search-input').val().trim().toLowerCase();
    const tokens = raw ? raw.split(/\s+/) : [];
    const types  = $('.filter-type:checked').map((_, el) => el.value).get();
    const brands = $('.filter-brand:checked').map((_, el) => el.value).get();

    const filtered = allCars.filter(car => {
      const b = car.brand.toLowerCase();
      const m = car.model.toLowerCase();
      const t = (car.type || '').toLowerCase();
      const d = (car.description || '').toLowerCase();

      // Each token must appear in at least one field
      const matchKey = tokens.length === 0 || tokens.every(tok =>
        b.includes(tok) || m.includes(tok) || t.includes(tok) || d.includes(tok)
      );

      const matchType  = !types.length || types.includes(car.type);
      const matchBrand = !brands.length || brands.includes(car.brand);

      return matchKey && matchType && matchBrand;
    });

    renderCarGrid(filtered);
  }

  /**
   * Render the car cards into the grid container.
   * @param {Array<Object>} carList
   */
  function renderCarGrid(carList) {
    const $grid = $('#car-grid').empty();

    if (!carList.length) {
      $grid.append('<p class="no-results">No cars found matching your search.</p>');
      return;
    }

    carList.forEach(car => {
      let actionBtn;
      if (car.available == 1) {
        actionBtn = `<a href="#" class="rent-btn" data-vin="${car.vin}">Rent</a>`;
      } else {
        actionBtn = `<button disabled class="rent-btn disabled">Unavailable</button>`;
      }

      const cardHtml = `
        <div class="card">
          <img src="img/${car.image_path}" alt="${car.brand} ${car.model}">
          <div class="card-body">
            <h3>${car.brand} ${car.model}</h3>
            <p>Type: ${car.type || 'Unknown'}</p>
            <p>Year: ${car.year || 'N/A'}</p>
            <p>Mileage: ${car.mileage ? car.mileage + ' km' : 'N/A'}</p>
            <p>Fuel: ${car.fuel_type || 'N/A'}</p>
            <p>Price: $${car.price_per_day}/day</p>
            ${actionBtn}
          </div>
        </div>`;
      $grid.append(cardHtml);
    });
  }
});
