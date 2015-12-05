
cardUi = {
    setCardSelectionEffects: function (card, isSelected) {
        var inWithTheNewNOTSelected = function (card, isSelected) {
            return card//$('div.card:not(div.card-selected)')
                .toggleClass('w3-card', !isSelected) //true
                .toggleClass('card-shake', !isSelected); //true
        }

        var inWithTheNewSelected = function (card, isSelected) {
            return card//$('div.card-selected')
                .toggleClass('w3-card-8', !!isSelected)
                .toggleClass('card-spin', !!isSelected);
        }

        var outWithTheOldNOTSelected = function (card, isSelected) {
            return card//$('div.card:not(div.card-selected)')
                .toggleClass('w3-card-8', !!isSelected);
        }

        var outWithTheOldSelected = function (card, isSelected) {
            return card//$('div.card-selected')
                .toggleClass('w3-card', !isSelected);
        }

        var notSelected = function (card, isSelected) {
            return outWithTheOldNOTSelected(card, isSelected)
                .ready(inWithTheNewNOTSelected(card, isSelected));
        }

        var selected = function (card, isSelected) {
            return outWithTheOldSelected(card, isSelected)
                .ready(inWithTheNewSelected(card, isSelected));
        }

        return notSelected(card, isSelected)
                .ready(selected(card, isSelected));
    },

    fireEffect: function (fireMyEffect) {
        // clone the item, add it and take the previous one away

        var el = fireMyEffect,
            newone = el.clone(true);
        //replaceDelayClasses(newone);
        el.before(newone);
        el.remove();
    },

    onCardSelect: function (ev) {
        var stripEffectsFromAllCards = function () { // The universe can only deal with one animation on a thing at a time wut? accommodate the universe
            return $('div.card')
                .removeClass('card-twisle card-spin card-jiggle card-flash card-jump card-shake');
        };
        stripEffectsFromAllCards();

        var getClickedCard = function (e) { // Derived from http://stackoverflow.com/questions/1553661/how-to-get-the-onclick-calling-object
            var targ;
            if (!e) var e = window.event;
            if (e.target) targ = e.target;
            else if (e.srcElement) targ = e.srcElement;
            if (targ.nodeType == 3) // defeat Safari bug
                targ = targ.parentNode;

            return $(targ).closest('.card');
        };

        var target = getClickedCard(ev);

        var isSelected = target.hasClass('card-selected');

        var isNowSelected = (!isSelected);
        target.toggleClass('card-selected', isNowSelected)
            .ready(this.setCardSelectionEffects(target, isNowSelected)
                .ready(function() { 
                    console.log('click ::::');
                    cardUi.fireEffect(target);
                }));

    }
};
