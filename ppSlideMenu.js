$('document').ready(function() {
    $('.ppSlideMenu').ppSlideMenu({});
});

//anim/layout, settings, -- after-square-top/left border-rotate45deg
(function($){
    
    $.fn.ppSlideMenu = function(settings) {
        const slideMenu = new SlideMenu(this, settings);
    };

    function SMLevel(){
        this.items = [];
        this.element;
        this.parentMenu = null;
    }

    function SMItem() {
        this.childMenu = null;
        this.element;
    }

    function SlideMenu(element, settings) {
        const _ = this;

        _.settings = settings;
        _.base = element;
        _.slide = $("<div class='SMSlide'></div>");

        _.pre_levels = [];
        _.final_levels = [];

        _.init();

    }

    SlideMenu.prototype.init = function() {
        const _ = this;
        
        base_level = new SMLevel();
        base_level.element = _.base;
        _.makeLevel(base_level);
        _.base.empty();
        _.slide.appendTo(_.base);
        

        while (_.pre_levels.length) {

            let level = _.pre_levels[0];
            let items = level.items;

            for (let i = 0; i < items.length; i++) {
                _.makeLevel(items[i], level);
            }

            _.final_levels.push(level);
            _.pre_levels.splice(0, 1);

        }

        _.layout();

    };

    SlideMenu.prototype.makeLevel = function(parent_item, parent_level) {
        const _ = this;
        const menuItems = $(parent_item.element).children()
            .filter("[data-ppSM='submenu']");

        if (menuItems.length) {

            let level = new SMLevel();
            level.parentMenu = parent_level;
            parent_item.childMenu = level;

            menuItems.each(function(){
                let item = new SMItem();
                item.element = $(this);
                level.items.push(item);
            });

            _.pre_levels.push(level);
        }
    };

    SlideMenu.prototype.buildLevel = function(level) {
        const _ = this;

        let wrapper = $('<div class="ppSM-level"><ul></ul></div>');

        if (level.parentMenu != null){
            let title =  'Return'; 
            let parent_return = $('<li>' + title + '</li>');

            parent_return.on('click', function(){
                _.prevMenu(level.parentMenu);
            });

            wrapper.append(parent_return);
        }

        for (let i = 0; i < level.items.length; i++) {
            let item = level.items[i];
            let item_content = item.element
                .children()
                .filter(":not([data-ppSM='submenu'])")
                .clone();
            let list_content = $('<li></li>').append(item_content);
            
            
            if (item.childMenu != null) {
                list_content.on('click', function() {
                    _.nextMenu(item.childMenu);
                });
            }

            list_content.appendTo(wrapper);
        }

        return wrapper;
    };

    SlideMenu.prototype.layout = function() {
        const _ = this;

        let base_build = _.buildLevel(_.final_levels[0])

        _.slide.append(base_build);
    };

    SlideMenu.prototype.prevMenu = function(){
        const _ = this;

        _.slide.animate({left: '+=200px'}, function(){
            _.slide.children().last().remove();
        });
    };

    SlideMenu.prototype.nextMenu = function(level) {
        const _ = this;

        let built_level = _.buildLevel(level);
        $("<div class='ppSM-level'></div>").appendTo(_.slide).html(built_level);
        _.slide.animate({left: '-=200px'});
    };

})(jQuery);

