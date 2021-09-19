(function (exports) {
  $(function () {
    const titleEl = $('.product__title');
    const avgRatingEl = $('.product__avg-rating');
    const productStarsEl = $('.product__stars');

    const openReviewBtn = $('.product__open-review');
    const closeReviewBtn = $('.form__close-btn');

    const reviewsListEl = $('.reviews__list');

    const reviewModal = $('.modal');

    const starsTemplate = $('#stars-template').html();
    const reviewItemTemplate = $('#review-item-template').html();

    openReviewBtn.click(openReviewModal)
    closeReviewBtn.click(closeReviewModal)

    function openReviewModal() {
      reviewModal.show()
    }

    function closeReviewModal() {
      reviewModal.hide();
    }

    function populateProductDetails(product) {
      titleEl.text(product.name);
      avgRatingEl.text(product.averageRating);

      const starsTemplate = getStarsTemplate(product.averageRating);
      productStarsEl.append(starsTemplate);

      product.reviews.forEach((review) => {
        const template = $('<div></div>');
        template.html(reviewItemTemplate);

        template.find('.reviews__rating-num').text(review.rating);
        template.find('.reviews__rating-text').text(review.text);

        const reviewStarsTemplate = getStarsTemplate(review.rating);
        template.find('.reviews__stars').append(reviewStarsTemplate);

        reviewsListEl.append(template);
      })
    }

    function getStarsTemplate(rating) {
      const template = $('<div></div>');
      template.html(starsTemplate);

      const width = Math.round(rating) / 5 * 100;
      template.find('.stars__on').css('width', `${ width }%`)
      return template;
    }

    function loadDefaultProduct() {
      fetch('http://localhost:1500/product/default')
        .then(response => response.json())
        .then((data) => {
          const { data: product } = data;
          populateProductDetails(product)
        });
    }

    loadDefaultProduct();
  });


})(this);
