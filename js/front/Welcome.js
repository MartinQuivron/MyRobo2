
// Welcome.js
document.addEventListener("DOMContentLoaded", function() {
  const token = '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'; //git token for the access to public repositories
  // to modify generate your token and put yours
  const repo = 'MartinQuivron/MyRobo2'; // Access to github repository of MyRobo2

  // Fetch traffic views
  fetch(`https://api.github.com/repos/${repo}/traffic/views`, {
    headers: {
        'Authorization': `token ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
      const uniqueVisitors = data.uniques; // Unique visitors
      document.querySelector('.rect.visitors h1').innerText = uniqueVisitors;
  })
  .catch(error => console.error('Error fetching visitors:', error));

    // Fetch repository stars
    fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
            'Authorization': `token ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const stars = data.stargazers_count; // Total stars on the project
        document.querySelector('.rect.stars h1').innerText = stars;
    })
    .catch(error => console.error('Error fetching stars:', error));
});

let nCount = selector => {
  $(selector).each(function () {
    $(this)
      .animate({
        Counter: $(this).text()
      }, {
        // A string or number determining how long the animation will run.
        duration: 4000,
        // A string indicating which easing function to use for the transition.
        easing: "swing",
        /*
         * A function to be called for each animated property of each animated element. 
         * This function provides an opportunity to
         * Modify the Tween object to change the value of the property before it is set.
         */
        step: function (value) {
          $(this).text(Math.ceil(value));
        }
      });
  });
};

let a = 0;
$(window).scroll(function () {
  // The .offset() method allows us to retrieve the current position of an element  relative to the document
  let oTop = $(".numbers").offset().top - window.innerHeight;
  if (a == 0 && $(window).scrollTop() >= oTop) {
    a++;
    nCount(".rect > h1");
  }
});



/**
 *
 *  sticky navigation
 *
 */

let navbar = $(".navbar");

$(window).scroll(function () {
  // get the complete hight of window
  let oTop = $(".section-2").offset().top - window.innerHeight;
  if ($(window).scrollTop() > oTop) {
    navbar.addClass("sticky");
  } else {
    navbar.removeClass("sticky");
  }
});

// Make the site go back to the top
function scrollToTop() {
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
}

