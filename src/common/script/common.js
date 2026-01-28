import '@/common/style/ddn/common.css'
import '@/common/style/ddn/classic-themes.css'
import '@/common/style/ddn/cleantalk-public.css'
import '@/common/style/ddn/cleantalk-email-decoder.css'
import '@/common/style/ddn/wpdm-icons.css'
import '@/common/style/ddn/front.css'
import '@/common/style/ddn/style1.css'
import '@/common/style/ddn/fonts.css'
import '@/common/style/ddn/style.css'
import '@/common/style/ddn/hero-carousel.css'
import '@/common/style/ddn/stats-text-cards.css'
import '@/common/style/ddn/solutions.css'
import '@/common/style/ddn/contact-section.css'
import '@/common/style/ddn/latest-news.css'
import '@/common/style/ddn/cascade-block.css'
import '@/common/style/ddn/cta-block.css'
import '@/common/style/ddn/logos-list.css'
import '@/common/style/ddn/cards-text.css'
import '@/common/style/ddn/complex-block.css'

import '@/common/style/ddn/article.css'

// import jQuery from 'jquery'
// import ejs from 'ejs/ejs.js';
// import 'bootstrap'
// import jcf from 'jcf'
// import jcf from 'jcf/dist/js/jcf.js'
// import 'jcf/dist/js/jcf.select.js'

import 'slick-carousel';



// 全局修改定界符（例如改为 {{ }}）
// ejs.openDelimiter = '{{';   // 开符号
// ejs.closeDelimiter = '}}';  // 闭符号
// ejs.delimiter = '%';        // 短语法符号（例如 {{% }} 替代 <%= %>）

// window.ejs = ejs;

// var $ = jQuery
// window.jQuery = window.$ = jQuery

// $(document).ready(() => {
//   // window.jcf = jcf
//   // ; (function ($) {
//   //     $.fn.modal = function () {
//   //         this.css({ 'z-index': 99999 }).slideDown(function () {
//   //             $(this).addClass('show')
//   //         })
//   //         let modal = this
//   //         this.after('<div class="modal-backdrop fade show wpdm-mbd" style="z-index: 9999;transition: all ease-in-out 400ms"></div>')
//   //         modal.trigger('shown.bs.modal')
//   //         this.find('[data-dismiss="modal"]').on('click', function (e) {
//   //             modal.removeClass('show').slideUp(function () {
//   //                 modal.trigger('hidden.bs.modal')
//   //             })
//   //             jQuery('.wpdm-mbd').remove()
//   //         })
//   //     }
//   //     $.fn.tooltip = function () { }
//   // })(jQuery)
//   // jQuery(function ($) {
//   //     var $body = $('body')
//   //     $body.on('click', '.w3eden [data-toggle="collapse"]', function (e) {
//   //         e.preventDefault()
//   //         $($(this).attr('href')).slideToggle()
//   //     })
//   //     $body.on('click', '.w3eden [data-toggle="modal"]', function (e) {
//   //         e.preventDefault()
//   //         $($(this).data('target')).modal('show')
//   //     })
//   //     $body.on('click', '.w3eden [data-toggle="tab"]', function (e) {
//   //         e.preventDefault()
//   //         const $tabs = $(this).parents('.nav-tabs')
//   //         $tabs.find('a').each(function () {
//   //             $(this).removeClass('active')
//   //             $($(this).attr('href')).removeClass('active')
//   //         })
//   //         $(this).addClass('nav-link active')
//   //         $($(this).attr('href')).addClass('active')
//   //     })
//   // })

//   function fullHeightPage() {
//     function setHeight() {
//       var vh = window.innerHeight * 0.01
//       document.documentElement.style.setProperty('--vh', vh + 'px')
//     }
//     setHeight()
//     window.addEventListener('resize', setHeight)
//   }
//   fullHeightPage()


//   function stickyHeader() {
//     var header = document.querySelector('.header')

//     function stickyHeaderOnScroll() {
//       if (window.scrollY < 20) {
//         header.classList.remove('sticky')
//       }
//       var currentScroll = window.scrollY
//       if (currentScroll > 20) {
//         header.classList.add('sticky')
//       } else {
//         header.classList.remove('sticky')
//       }
//     }

//     window.addEventListener('load', function () {
//       stickyHeaderOnScroll()
//     })

//     window.addEventListener('scroll', stickyHeaderOnScroll)
//   }
//   stickyHeader()


//   function mobileNav() {
//     var body = $('body')
//     var btnMenu = $('.btn-menu')
//     var mainNav = $('.main-menu')
//     var mainNavItems = mainNav.find('.menu-item-has-children')
//     var arrowButton =
//       '<span class="arrow-button">\n<svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 5.35199L11.8469 6.02798L8.37065 9.62659C7.88978 10.1245 7.11016 10.1245 6.62929 9.62659L3.15301 6.02798L2.5 5.35199L3.80601 4L4.45902 4.67599L7.49997 7.82399L10.541 4.67599L11.1939 4L12.5 5.35199Z" fill="white"/>\n</svg>\n</span>'
//     var activeMenuItem = void 0

//     //burger
//     btnMenu.on('click', function (e) {
//       var $this = $(this)
//       // $this.text() === "菜单" ? $this.text("关闭") : $this.text("Menu");
//       if (!$this.hasClass('open')) {
//         $this.text('关闭')
//         $this.addClass('open')
//         body.addClass('menu-opened')
//       } else {
//         $this.removeClass('open')
//         body.removeClass('menu-opened')
//         $this.text('菜单')
//       }
//       // mainNav.find('> li').removeClass('active').show();
//       // mainNav.find('> .menu-item-has-children').removeClass('active');
//       e.preventDefault()
//     })

//     //append arrow and back buttons
//     mainNavItems.each(function (i, item) {
//       var menuList = $(item).find(' > .sub-menu')
//       if (!$(item).find('.arrow').length) {
//         $(arrowButton).insertBefore(menuList, null)
//       }
//     })

//     function closeDropdown(e) {
//       if (!$('.main-menu .menu-item-has-children').has(e.target).length > 0) {
//         $('.main-menu .menu-item-has-children').removeClass('active').find('.sub-menu').slideUp()
//         window.removeEventListener('click', closeDropdown)
//       }
//     }

//     //show/hide menu
//     $(document).on('click', '.main-menu .menu-item-has-children', function (e) {
//       // const target = $(e.target);

//       // if (target.closest('.arrow-button').length) {
//       // activeMenuItem = target.closest('.arrow-button').parent();
//       activeMenuItem = $(this)
//       if (window.innerWidth < 1200) {
//         if (!activeMenuItem.hasClass('active')) {
//           activeMenuItem.siblings().removeClass('active').find('.sub-menu').slideUp()
//           activeMenuItem.addClass('active').find('.sub-menu').slideDown()
//         } else {
//           activeMenuItem.removeClass('active').find('.sub-menu').slideUp()
//         }
//       }
//       if (window.innerWidth > 1200 && body.hasClass('touch')) {
//         if (!activeMenuItem.hasClass('active')) {
//           activeMenuItem.siblings().removeClass('active').find('.sub-menu').fadeOut()
//           activeMenuItem.addClass('active').find('.sub-menu').fadeIn()
//         } else {
//           activeMenuItem.removeClass('active').find('.sub-menu').fadeOut()
//         }
//         // window.addEventListener('click', closeDropdown);
//       }
//       // }
//     })

//     // //show/hide menu
//     // $(document).on("click", ".main-menu .arrow-button", function () {
//     //     let $this = $(this);
//     //     let parent = $this.parent();
//     //     if ($(window).width() < 1200) {
//     //         if (!parent.hasClass("active")) {
//     //             parent.addClass("active").find(".sub-menu").slideDown();
//     //         } else {
//     //             parent.removeClass("active").find(".sub-menu").slideUp();
//     //         }
//     //     } else {
//     //         if (!parent.hasClass("active")) {
//     //             parent.addClass("active").find(".sub-menu").fadeIn();
//     //         } else {
//     //             parent.removeClass("active").find(".sub-menu").fadeOut();
//     //         }
//     //     }
//     // });
//   }

//   mobileNav()


//   function headerSearch() {
//     var headerMenu = $('.header-menu')
//     var openSearchButton = $('.btn-search-open')
//     var closeSearchButton = $('.btn-search-close')

//     openSearchButton.on('click', function () {
//       headerMenu.addClass('active')
//     })

//     closeSearchButton.on('click', function () {
//       headerMenu.removeClass('active')
//     })
//   }

//   headerSearch()



//   function animationOnScroll() {
//     var $window = $(window);
//     var $items = $(".has-animation");

//     function checkAnimation() {
//        $items.each(function (i, it) {
//         if (
//           $window.scrollTop() >
//           $(it).offset().top - $window.height() * 0.88
//         ) {
//           $(it).addClass("animated");
//         }
//       });
//     }
//     $window.on("scroll load", function () {
//       checkAnimation();
//     });
//     checkAnimation();
//   }

//   animationOnScroll()

//   window.animationOnScroll = animationOnScroll;


//   function accordion() {
//     var accordionBlock = $(".accordion");
//     accordionBlock.on("click", ".heading", function (e) {
//       var accordion = $(this).parents(".accordion");
//       var parent = $(this).parent();
//       if (!parent.hasClass("opened")) {
//         setTimeout(function () {
//           accordion.find(".accordion-item").removeClass("opened");
//           parent.addClass("opened");
//           var video = parent.find("video");
//           if (video.length && video[0].paused) {
//             video[0].play();
//           }
//         }, 400);
//         accordion.find(".accordion-item").find(".hidden-info").slideUp();
//         parent.find(".hidden-info").slideDown();
//         accordion.find("video").each(function () {
//           $(this)[0].pause();
//         });
//       }
//       e.preventDefault();
//     });

//     accordionBlock.each(function () {
//       var $accordion = $(this);
//       var firstItem = $accordion.find(".accordion-item:first-child");
//       firstItem.addClass("opened");
//       if (firstItem.find("video").length) {
//         firstItem.find("video")[0].play();
//       }
//     });
//   }

//   accordion()


//   function testimonialsSlider() {
//     $(".testimonials-slider-holder").each(function () {
//       var slider = $(this).find(".testimonials-slider");
//       var sliderNav = $(this).find(".testimonials-controls");
//       slider.slick({
//         slidesToScroll: 1,
//         slidesToShow: 1,
//         dots: true,
//         fade: true,
//         appendArrows: sliderNav,
//         appendDots: sliderNav,
//       });
//     });
//   }

//   testimonialsSlider()

//   // function customSelect() {
//   //   if ($("select").length) {
//   //     jcf.setOptions("Select", {
//   //       wrapNative: false,
//   //       flipDropToFit: false,
//   //       fakeDropInBody: false,
//   //       maxVisibleItems: 8,
//   //     });

//   //     jcf.replaceAll();
//   //   }
//   // }

//   // customSelect()


//   function solutionSlider() {
//     var $window = $(window);
//     var $slider = $(".solutions-list.has-slider");
//     $slider.each(function () {
//       var $this = $(this);
//       $window.on("load resize", function () {
//         if ($window.innerWidth() >= 768) {
//           if ($this.hasClass("slick-initialized")) {
//             $this.slick("refresh");
//             $this.slick("unslick");
//           }
//         } else {
//           if (!$this.hasClass("slick-initialized")) {
//             $this.slick({
//               slidesToScroll: 1,
//               slidesToShow: 1,
//               infinite: false,
//               arrows: false,
//               dots: true,
//               mobileFirst: true,
//               responsive: [
//                 {
//                   breakpoint: 567,
//                   settings: {
//                     slidesToShow: 2,
//                     slidesToScroll: 1,
//                   },
//                 },
//               ],
//             });
//           }
//         }
//       });
//     });
//   }

//   solutionSlider()


//   function solutionCardsSlider() {
//     var $window = $(window);
//     var $slider = $(".solutions-cards.has-slider");
//     $slider.each(function () {
//       var $this = $(this);
//       $window.on("load resize", function () {
//         if ($window.innerWidth() >= 1024) {
//           if ($this.hasClass("slick-initialized")) {
//             $this.slick("refresh");
//             $this.slick("unslick");
//           }
//         } else {
//           if (!$this.hasClass("slick-initialized")) {
//             $this.slick({
//               slidesToScroll: 1,
//               slidesToShow: 1,
//               infinite: false,
//               arrows: false,
//               dots: true,
//               mobileFirst: true,
//               responsive: [
//                 {
//                   breakpoint: 567,
//                   settings: {
//                     slidesToShow: 2,
//                     slidesToScroll: 1,
//                   },
//                 },
//               ],
//             });
//           }
//         }
//       });
//     });
//   }


//   solutionCardsSlider()


//   function resourcesListSlider() {
//     var $window = $(window);
//     var $slider = $(".resources-list.has-slider");
//     $slider.each(function () {
//       var $this = $(this);
//       $window.on("load resize", function () {
//         if ($window.innerWidth() >= 1024) {
//           if ($this.hasClass("slick-initialized")) {
//             $this.slick("refresh");
//             $this.slick("unslick");
//           }
//         } else {
//           if (!$this.hasClass("slick-initialized")) {
//             $this.slick({
//               slidesToScroll: 1,
//               slidesToShow: 1,
//               infinite: false,
//               arrows: false,
//               dots: true,
//               mobileFirst: true,
//               responsive: [
//                 {
//                   breakpoint: 767,
//                   settings: {
//                     slidesToShow: 2,
//                     slidesToScroll: 1,
//                     infinite: true,
//                     dots: true,
//                   },
//                 },
//               ],
//             });
//           }
//         }
//       });
//     });
//   }
//   resourcesListSlider()


//   function historySlider() {
//     $(".history-section").each(function () {
//       var slider = $(this).find(".history-slider");
//       var sliderNav = $(this).find(".history-slider-controls");
//       slider.slick({
//         slidesToScroll: 1,
//         slidesToShow: 1,
//         infinite: false,
//         appendArrows: sliderNav,
//         mobileFirst: true,
//         responsive: [
//           {
//             breakpoint: 567,
//             settings: {
//               slidesToScroll: 2,
//               slidesToShow: 2,
//             },
//           },
//         ],
//       });
//     });
//   }

//   historySlider()



//   function cardsCarousel() {
//     $(".cards-carousel-wrap").each(function () {
//       var cardsWrapper = $(this);

//       cardsWrapper.find(".cards-carousel").each(function () {
//         var cardsCarousel = $(this);

//         $(window).on("scroll load resize", function () {
//           var scrollTop = $(window).scrollTop();
//           var windowWidth = $(window).width();
//           var cardsWrapperOffsetTop = cardsWrapper.offset().top;
//           var cardsWrapperHeight = cardsWrapper.innerHeight();
//           if (
//             scrollTop + windowWidth > cardsWrapperOffsetTop &&
//             scrollTop < cardsWrapperOffsetTop + cardsWrapperHeight
//           ) {
//             var indent =
//               ((scrollTop + windowWidth - cardsWrapperOffsetTop) /
//                 windowWidth) *
//               100 *
//               0.3;
//             cardsCarousel.css(
//               "transform",
//               "translateX(-" + indent + "%)"
//             );
//             if (cardsCarousel.hasClass("reverse")) {
//               cardsCarousel.css(
//                 "transform",
//                 "translateX(" + indent + "%)"
//               );
//             }
//           }
//         });
//       });
//     });
//   }
//   cardsCarousel()



//   function tabs() {
//     $(".tabs-holder .tabs-nav").on("click", "a", function (e) {
//       var tab = $(this).parent();
//       var tabsNav = tab.closest(".tabs-nav");
//       var tabIndex = tab.index();
//       var tabPanel = tab.closest(".tabs-holder");
//       var tabPane = tabPanel.find(".tab").eq(tabIndex);
//       var totalWidth = 0;

//       tabPanel.find(".active").removeClass("active");
//       tabPane.addClass("active");
//       tabsNav.find("li").removeClass("active");
//       tab.addClass("active");

//       for (var i = 0; i < tabIndex; i++) {
//         totalWidth += tabsNav.find("li").eq(i).innerWidth();
//       }
//       tabsNav.animate({ scrollLeft: totalWidth }, 500);
//       e.preventDefault();
//     });
//   }
//   tabs();



//   function anchors() {
//     var body = $("body");
//     var $menu = $(".header");
//     var $pageNavHolder = $(".page-nav-anchor");
//     var currentWidth = 0;
//     body.on("click", ".has-anchor, .page-nav-anchor a", function (e) {
//       e.preventDefault();
//       var $this = $(this);
//       var target = $this.attr("href").slice(1);
//       if (target) {
//         var scrollTop = $(window).scrollTop();
//         var anchoredBlock = $("[id=" + target + "]");
//         var headerHeight = $menu.length ? $menu.innerHeight() : 0;
//         if (anchoredBlock.length) {
//           var anchoredBlockTop = anchoredBlock.offset().top;
//           if (scrollTop > anchoredBlockTop) {
//             if ($pageNavHolder.length) {
//               $("html, body").animate(
//                 { scrollTop: anchoredBlockTop - (headerHeight + 10) },
//                 500
//               );
//             } else {
//               $("html, body").animate(
//                 { scrollTop: anchoredBlockTop - headerHeight },
//                 500
//               );
//             }
//           } else {
//             if ($pageNavHolder.length) {
//               $("html, body").animate(
//                 { scrollTop: anchoredBlockTop - (headerHeight + 10) },
//                 500
//               );
//             } else {
//               $("html, body").animate(
//                 { scrollTop: anchoredBlockTop },
//                 500
//               );
//             }
//           }
//         }
//       }
//     });

//     function sticky() {
//       if ($pageNavHolder.length) {
//         var pageNav = $pageNavHolder;
//         var pageNavTop = pageNav.offset().top;
//         var scrollTop = $(window).scrollTop();
//         var headerHeight = $menu.innerHeight();
//         var pageNavHeight = pageNav.innerHeight();
//         pageNav.find("ul li").each(function (index, section) {
//           var target = $(section).find("a").attr("href");
//           if ($(target).length) {
//             $(target).addClass("section-for-sticky-nav");
//           }
//         });

//         $(".section-for-sticky-nav").each(function (index, section) {
//           var $this = $(section);
//           var itemOffsetTop = $this.offset().top;
//           var indent = 0;
//           if ($menu.hasClass("hide")) {
//             indent = pageNavHeight + 100;
//           } else {
//             indent = headerHeight + pageNavHeight + 20;
//           }
//           if (scrollTop + indent >= itemOffsetTop) {
//             var attr = $this.attr("id");
//             if (!$this.hasClass("active")) {
//               $this.addClass("active");
//               if (pageNav.find('a[href="#' + attr + '"]').length) {
//                 pageNav
//                   .find('a[href="#' + attr + '"]')
//                   .parent()
//                   .addClass("active")
//                   .prev()
//                   .addClass("prev");
//               }
//             }
//           } else {
//             $this.removeClass("active");
//             var _attr = $this.attr("id");
//             if (pageNav.find('a[href="#' + _attr + '"]').length) {
//               pageNav
//                 .find('a[href="#' + _attr + '"]')
//                 .parent()
//                 .removeClass("active")
//                 .prev()
//                 .removeClass("prev");
//             }
//           }
//         });

//         var tabsNav = pageNav.find("ul");
//         var tabIndex = tabsNav.find("li.active:not(.prev)").index();
//         var totalWidth = 0;

//         for (var i = 0; i < tabIndex; i++) {
//           totalWidth += tabsNav.find("li.active").eq(i).innerWidth();
//         }
//         if (currentWidth !== totalWidth) {
//           tabsNav.animate({ scrollLeft: totalWidth }, 500);
//           currentWidth = totalWidth;
//         }
//       }
//     }

//     $(window).on("load scroll resize", function () {
//       sticky();
//     });
//   }


//   anchors();
// })


// function contactsForm() {
//   // Trigger Popup
//   document.addEventListener("DOMContentLoaded", function () {
//     let triggerButtons = document.querySelectorAll(
//       ".trigger-popup-form"
//     );

//     triggerButtons.forEach(function (button) {
//       button.addEventListener("click", function (e) {
//         e.preventDefault();

//         let popupForm = this.nextElementSibling
//           ? this.nextElementSibling
//           : this.parentNode.nextElementSibling;

//         if (popupForm && popupForm.classList.contains("popup-form")) {
//           popupForm.classList.add("popup-form--active");
//           document.body.classList.add("popup-active");

//           let closeButton = popupForm.querySelector(".popup-close");
//           if (closeButton) {
//             closeButton.addEventListener("click", function () {
//               popupForm.classList.remove("popup-form--active");
//               document.body.classList.remove("popup-active");
//             });
//           }
//         }
//       });
//     });
//   });

//   // Trigger Forms
//   document.addEventListener("DOMContentLoaded", function () {
//     let allForms = document.querySelectorAll(".pardot-form");

//     formUTM();

//     allForms.forEach(function (form) {
//       let pardotButton = form.querySelector(".btn");
//       let pardotSub = "mkt";
//       let pardotID = form.getAttribute("data-id");
//       let pardotAction = "https://" + pardotSub + ".ddn.com" + pardotID;

//       let children = form.querySelectorAll(
//         "input:not([type='hidden']), textarea:not(#captureall), select:not(.pardot-form__disabled)"
//       );

//       children.forEach(function (element) {
//         element.addEventListener("blur", function () {
//           if (element.classList.contains("error")) {
//             element.classList.remove("error");
//           }
//         });
//       });

//       pardotButton.addEventListener("click", function (e) {
//         // e.preventDefault();
//         let findEmpty = Array.from(children).find(function (element) {
//           if (element.value.length < 1) {
//             return true;
//           }
//           return false;
//         });

//         if (findEmpty) {
//           if (findEmpty.tagName === "SELECT") {
//             findEmpty.parentElement.classList.add("select-error");
//           }
//           findEmpty.classList.add("error");
//           console.log(findEmpty.focus());
//         } else {
//           prependComments();
//           form.action = pardotAction;
//           form.submit();
//         }
//       });

//       let pardotTrigger = form.querySelector(".pardot-form__trigger");
//       let pardotDisabled = form.querySelector(".pardot-form__disabled");

//       if (pardotDisabled) {
//         let pardotDisabledParent = pardotDisabled.closest("div");
//         if (pardotDisabledParent) {
//           pardotDisabledParent.classList.add("pardot-form__disabled");
//         }

//         if (pardotTrigger) {
//           let usState = form.querySelector('optgroup[label*="State"]');
//           let caProvince = form.querySelector(
//             'optgroup[label*="Province"]'
//           );

//           pardotTrigger.addEventListener("change", function (e) {
//             this.parentElement.classList.remove("select-error");
//             if (e.target.value == "美国") {
//               pardotDisabledParent.classList.add("us-active");
//               pardotDisabledParent.classList.remove(
//                 "pardot-form__disabled",
//                 "ca-active"
//               );
//               pardotDisabled.classList.remove("pardot-form__disabled");
//               pardotDisabled.required = true;
//               caProvince.style.display = "none";
//               caProvince.disabled = true;
//               usState.style.display = "block";
//               usState.disabled = false;
//               usState.querySelector('option[value=""]').selected = true;
//             } else if (e.target.value == "加拿大") {
//               pardotDisabledParent.classList.add("ca-active");
//               pardotDisabledParent.classList.remove(
//                 "pardot-form__disabled",
//                 "us-active"
//               );
//               pardotDisabled.classList.remove("pardot-form__disabled");
//               pardotDisabled.required = true;
//               usState.style.display = "none";
//               usState.disabled = true;
//               caProvince.style.display = "block";
//               caProvince.disabled = false;
//               caProvince.querySelector(
//                 'option[value=""]'
//               ).selected = true;
//             } else {
//               pardotDisabled.required = false;
//               pardotDisabledParent.classList.add(
//                 "pardot-form__disabled"
//               );
//               pardotDisabled.classList.add("pardot-form__disabled");
//               usState.querySelector('option[value=""]').selected = true;
//             }

//             jcf.destroy();
//             jcf.replaceAll();
//           });
//         }
//       }
//     });
//   });

//   // Capture UTM's
//   function formUTM() {
//     const searchParams = new URLSearchParams(window.location.search);

//     // configure these as necessary from url parameters
//     const utmParams = [
//       "utm_campaign",
//       "utm_medium",
//       "utm_source",
//       "utm_content",
//       "utm_term",
//     ];

//     // this only works when the hidden field ID is named the same as the UTM parameter
//     utmParams.forEach((param) => {
//       if (searchParams.has(param)) {
//         const input = document.getElementById(param);
//         if (input) {
//           input.value = searchParams.get(param);
//         }
//       }
//     });
//   }

//   /* Prepend fields to Comments form */
//   function prependComments() {
//     let prependForm = document.querySelector(".prepend-comments");

//     if (prependForm) {
//       let productName = prependForm.querySelector("#product").value;
//       let requestType = prependForm.querySelector("#request").value;
//       let commentsArea = prependForm.querySelector("#comments").value;

//       let captureAll = prependForm.querySelector("#captureall");

//       let mergeAll =
//         "\n\n" +
//         productName +
//         "\n\n" +
//         requestType +
//         "\n\n" +
//         commentsArea +
//         "\n\n";

//       captureAll.value = mergeAll;
//     }
//   }
// }

// contactsForm()






  ; !(function (t) {
    'function' == typeof define && define.amd ? define(t) : t()
  })(function () {
    var t
    !(function () {
      var t = [],
        e = ['click', 'mousemove', 'keydown', 'touchstart', 'touchmove', 'wheel'],
        n = document.querySelectorAll('script[data-src]'),
        r = document.querySelectorAll('link[data-href]')
      if (n.length || r.length) {
        var a = function (e) {
          return t.push(e)
        }
        document.addEventListener('click', a, { passive: !0 })
        var o = setTimeout(c, 5000)
        e.forEach(function (t) {
          window.addEventListener(t, c, { passive: !0 })
        })
      }
      function i(e) {
        var r = n[e]
          ; (r.onload = function () {
            if (e >= n.length - 1)
              return (
                window.dispatchEvent(new Event('DOMContentLoaded')),
                window.dispatchEvent(new Event('load')),
                document.removeEventListener('click', a),
                void t.forEach(function (t) {
                  var e = new MouseEvent('click', { view: t.view, bubbles: !0, cancelable: !0 })
                  t.target.dispatchEvent(e)
                })
              )
            i(e + 1)
          }),
            (r.src = r.getAttribute('data-src'))
      }
      function c() {
        clearTimeout(o),
          e.forEach(function (t) {
            window.removeEventListener(t, c, { passive: !0 })
          }),
          n.forEach(function (t) {
            var e = t.getAttribute('data-src')
            if (!e.startsWith('data:')) {
              var n = document.createElement('link')
                ; (n.rel = 'preload'), (n.as = 'script'), (n.href = e), document.head.appendChild(n)
            }
          }),
          n.length && i(0),
          r.forEach(function (t) {
            t.href = t.getAttribute('data-href')
          })
      }
    })(),
      (t = new IntersectionObserver(
        function (e) {
          e.forEach(function (e) {
            e.isIntersecting &&
              (t.unobserve(e.target),
                e.target
                  .getAttribute('data-lazy-attributes')
                  .split(',')
                  .forEach(function (t) {
                    var n = e.target.getAttribute('data-lazy-'.concat(t))
                    e.target.setAttribute(t, n)
                  }))
          })
        },
        { rootMargin: '300px' },
      )),
      document.querySelectorAll("[data-lazy-method='viewport']").forEach(function (e) {
        t.observe(e)
      })
  })