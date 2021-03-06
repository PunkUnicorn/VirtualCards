﻿
cardUi = {
    setCardSelectionEffects: function (card, isSelected) {
        var inWithTheNewNOTSelected = function (cardi, isSelected) {
            if (cardi.length == 0) return cardi;
            var isNotSelected = !isSelected;
            cardi.toggleClass('w3-card', isNotSelected)
                .toggleClass('card-shake', isNotSelected);
                
            return cardi;
        };

        var inWithTheNewSelected = function (cardi, isSelected) {
            if (cardi.length == 0) return cardi;
            var isTrueSelected = !!isSelected;
            cardi.toggleClass('w3-card-8', isTrueSelected)
                .toggleClass('card-spin', isTrueSelected);
            return cardi;
        };

        var ons = function (cardii, isSelected) {
            if (cardii.length == 0) return cardii;
            var isTrueSelected = !!isSelected;
            cardii.toggleClass('w3-card-8', isTrueSelected);
            return cardii;
        };

        var outWithTheOldSelected = function (cardi, isSelected) {
            if (cardi.length == 0) return cardi;
            var isNotSelected = !isSelected;
            cardi.toggleClass('w3-card', isNotSelected);                
            return cardi;
        };

        var notSelected = function (cardi, isSelected) {
            if (cardi.length == 0) return cardi;
            ons(cardi, isSelected);
            inWithTheNewNOTSelected(cardi, isSelected);
            return cardi;
        };

        var selected = function (cardi, isSelected) {
            if (cardi.length == 0) return cardi;
            outWithTheOldSelected(cardi, isSelected);
            inWithTheNewSelected(cardi, isSelected);
            return cardi;
        };

        notSelected(card, isSelected);
        selected(card, isSelected);        
    },

    fireEffect: function (fireMyEffect) {
        // clone the item, add it and take the previous one away
        var el = fireMyEffect,
            newone = el.clone(true);

        el.before(newone);
        el.remove();
    },

    onCardSelect: function (ev, gameObj, cardSelection, negociateSelection) {
        var stripEffectsFromAllCards = function () { // The universe can only deal with one animation on a thing at a time wut? accommodate the universe
            $('div.card').removeClass('card-twisle card-spin card-jiggle card-flash card-jump card-shake card-spin-delay1 card-spin-delay2 card-spin-delay4 card-jump-delay1 card-jump-delay2 card-jump-delay4');
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
        
        if (!negociateSelection(target, gameObj, isNowSelected, cardSelection)) 
        {
            this.setCardSelectionEffects(target, false);
            cardUi.fireEffect(target);
            return;
        }
        
        target.toggleClass('card-selected', isNowSelected);
        
        window.setTimeout( function(target, isNowSelected) {
            cardUi.setCardSelectionEffects(target, isNowSelected);
            cardUi.fireEffect(target);
        }, 0, target, isNowSelected);
    }
};
