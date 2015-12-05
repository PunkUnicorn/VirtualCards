   // remove any delay classes and replace with non-delay versions
   function replaceDelayClasses(replaceMyClasses) {
      var cssClasses = [ "footy-spin", "footy-flash", "footy-twisle", "footy-jump", "footy-shake", "footy-jiggle" ];
      var delayPostfix = [ "-delay1", "-delay2", "-delay4" ];
      var cssClassesIndex = cssClasses.length;
      var delayPostfixLength = delayPostfix.length;

      while (cssClassesIndex--) {
         var cssClass = cssClasses[cssClassesIndex];
         var delayPostfixIndex = delayPostfixLength;
         while (delayPostfixIndex--) {
            var classPostfix = delayPostfix[delayPostfixIndex];
            var targetClass = cssClass + classPostfix;         
            if ($(replaceMyClasses).hasClass(targetClass)) {
               $(replaceMyClasses).removeClass(targetClass); 
               $(replaceMyClasses).addClass(cssClass);
               return;
            }
         }
      }
   }

   /* http://css-tricks.com/restart-css-animation/ */
   function fireEffect(fireMyEffect) {
      // clone the item, add it and take the previous one away

      var el = fireMyEffect,
                newone = el.clone(true);
      replaceDelayClasses(newone);
      el.before(newone);
      el.remove();
   }
   // refire the animation
   $(".footy-button").click(function () {
      fireEffect($(this));
   });

   /* trigger effects randomly if their class is asking for it
   footy-attention-seeker fire */
   function doSomething() {
      // http://stackoverflow.com/questions/3614944/how-to-get-random-element-in-jquery
      var attentionSeekers = $('.footy-attention-seeker');
      var rand = Math.floor(Math.random() * attentionSeekers.length);
      fireEffect(attentionSeekers.eq(rand));            
   }

   // http://stackoverflow.com/questions/6962658/randomize-setinterval-how-to-rewrite-same-random-after-random-interval
   (function loop() {
      var delayInterval = 15000;
      var rand = Math.round(Math.random() * (delayInterval - 500)) + 500;
      setTimeout(function () {
         doSomething();
         loop();
      }, rand);
   } ());


   // investigate animation finished quality
   // - anim.addEventListener("animationend", AnimationListener, false);
   // - http://www.sitepoint.com/css3-animation-javascript-event-handlers/
   // - http://ricostacruz.com/jquery.transit/source/