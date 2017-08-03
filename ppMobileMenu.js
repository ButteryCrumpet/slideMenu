$('document').ready(function() {
    $('.ppMobileMenu').ppSlideMenu({});
});

//default animations, settings for personal
//set dimensions properly + default CSS
(function($){
    
    $.fn.ppSlideMenu = function(settings) {
        const slideMenu = new SlideMenu(this, settings);
    };

    function MMSubMenu(){
        this.items = [];
        this.built_element = null;
        this.title = null;
        this.parentMenu = null;
    }

    function MMItem() {
        this.childMenu = null;
        this.element = null;
        this.title = null;
    }

    function SlideMenu(element, settings) {
        const _ = this;

        _.settings = {
            defaultAnims: true,
        };

        _.animStyle = '.ppMM-submenu{transition: 0.5s ease; transform: translate3d(100%, 0, 0);}';
        _.animStyle += '.ppMM-current {transform: translate3d(0, 0, 0);}';
        _.animStyle += '.ppMM-subOpen {transform: translate3d(-100%, 0, 0);}';
        
        _.defaultCSS = {

            SlideMenu: {
                overflow: 'hidden',
            },

            Submenu: {
                position: 'absolute',
                width: '100%',
                height: '100%',
            },

            Items: {
                position: 'relative',
                listStyle: 'none',
                cursor: 'pointer',
            }
        }

        _.base = element;
        _.pre_levels = [];
        _.final_levels = [];

        _.init();

    }

    SlideMenu.prototype.init = function() {
        const _ = this;
        
        base_level = new MMSubMenu();
        base_level.element = _.base;
        base_level.title = null;
        _.makeLevel(base_level);
        _.base.empty();
        

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
        _.applyCSS();

    };

    SlideMenu.prototype.makeLevel = function(parent_item, parent_level) {
        const _ = this;
        const menuItems = $(parent_item.element).children()
            .filter("[ppMM-submenu]");

        if (menuItems.length) {

            let level = new MMSubMenu();
            level.title = parent_item.title;
            level.parentMenu = parent_level;
            parent_item.childMenu = level;

            menuItems.each(function(){
                let item = new MMItem();
                item.element = $(this);
                item.title = item.element.attr('ppMM-submenu');
                level.items.push(item);
            });

            _.pre_levels.push(level);
        }
    };

    //should probably make method of subMenu class and abstract listeners
    SlideMenu.prototype.buildLevel = function(level) {
        const _ = this;

        let wrapper = $('<div class="ppMM-submenu"></div>');
        let list_element = $('<ul></ul>');

        let title = (level.title != null) ? level.title : 'Home';
        let parent_return = $('<li class="ppMM-title ppMM-item"><h1>' + title + '</h1></li>');
        list_element.append(parent_return);

        if (level.parentMenu != null){
            parent_return.addClass('ppMM-prevExists');
            parent_return.on('click', function(){
                _.prevMenu(level);
            });
        }

        for (let i = 0; i < level.items.length; i++) {
            let item = level.items[i];
            let item_content = item.element
                .children()
                .filter(":not([ppMM-submenu])")
                .clone();
            let list_content = $('<li class="ppMM-item"></li>').append(item_content);
            
            
            if (item.childMenu != null) {
                list_content.addClass('ppMM-subExists')
                list_content.on('click', function() {
                    _.nextMenu(item.childMenu);
                });
            }

            list_content.appendTo(list_element);
        }
        
        return wrapper.append(list_element);
    };

    SlideMenu.prototype.layout = function() {
        const _ = this;

        for (let i = 0; i < _.final_levels.length; i++) {
            let level = _.final_levels[i];
            level.built_level = _.buildLevel(level);
            _.base.append(level.built_level);
            if (i > 0) {
                level.built_level.addClass('ppMM-hidden');
            } else {
                level.built_level.addClass('ppMM-current');
            }
        }
    };

    SlideMenu.prototype.prevMenu = function(level){
        const _ = this;

        level.built_level.removeClass('ppMM-current')
            .addClass('ppMM-Hidden');
        
        level.parentMenu.built_level.addClass('ppMM-current')
            .removeClass('ppMM-subOpen');
        
    };

    SlideMenu.prototype.nextMenu = function(level) {
        const _ = this;

        level.built_level.removeClass('ppMM-hidden')
            .addClass('ppMM-current');
        
        level.parentMenu.built_level.removeClass('ppMM-current')
            .addClass('ppMM-subOpen');
    };

    SlideMenu.prototype.applyCSS = function() {
        const _ = this;

        $('.ppMM-submenu').css(_.defaultCSS.Submenu);
        $('.ppMM-item').css(_.defaultCSS.Items);
        _.base.css(_.defaultCSS.SlideMenu);

        if (_.settings.defaultAnims) {
            let styletag = $('<style>' + _.animStyle + '</style>')
            _.base.append(styletag);
        }
    };

})(jQuery);

