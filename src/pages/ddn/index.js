
import '@/common/script/common.js'
import './index.css'
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';


import ajax from '@/common/script/ajax.js'
import processAbstractImg from '@/common/script/processAbstractImg.js';

// import imageHomePage1 from '../../assets/image/home/ddn-homepage-bg-1920x1080-1.png'
// import imageHomePage2 from '../../assets/image/home/ddn-homepage-bg-1920x1080-1-300x169.png'
// import imageHomePage3 from '../../assets/image/home/ddn-homepage-bg-1920x1080-1-1024x577.png'
// import imageHomePage4 from '../../assets/image/home/ddn-homepage-bg-1920x1080-1-768x432.png'
// import imageHomePage5 from '../../assets/image/home/ddn-homepage-bg-1920x1080-1-1536x865.png'



// $(document).ready(() => {

//     //    triggerHeroCarousel();


//     function load_flying_press_youtube_video(t) {
//         let e = document.createElement("iframe");
//         e.setAttribute("src", t.getAttribute("data-src")),
//             e.setAttribute("frameborder", "0"),
//             e.setAttribute("allowfullscreen", "1"),
//             e.setAttribute("allow", "autoplay; encrypted-media; gyroscope;"),
//             t.innerHTML = "",
//             t.appendChild(e)
//     }

//     window.load_flying_press_youtube_video = load_flying_press_youtube_video;



//     ajax({
//         url: `/endpoint/content/1`,
//         // dataType: "json",
//         type: 'POST',
//         data: JSON.stringify({
//             type: 1
//         }),
//         success: function (data) {
//             if (data && data.list.length > 0) {
//                 // let templateStr = $("#v-template-hero-carousel-template").html();
//                 // // let contentStr = ejs.render(templateStr, { list:[...(data.list),...(data.list),...(data.list),...(data.list)].map(it=>{
//                 // //     return {
//                 // //         ...it,
//                 // //         abstractImg:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
//                 // //     }
//                 // // })});
//                 // let contentStr = ejs.render(templateStr, { list: [...(data.list)], imageHomePage1,imageHomePage2,imageHomePage3,imageHomePage4,imageHomePage5 });
//                 // $('#home-hero-carousel-content-1').html(contentStr)
//                 // triggerHeroCarousel();
//             } else {
//                 // let templateStr = $("#v-template-hero-carousel-template").html();
//                 // let contentStr = ejs.render(templateStr, { list: [] });
//                 // $('#home-hero-carousel-content-1').html(contentStr)
//             }
//         },
//         fail: function (err) {
//             console.log(err)
//         }
//     })

//     ajax({
//         url: `/endpoint/content/latest`,
//         // dataType: "json",
//         // type: 'POST',
//         // data: JSON.stringify({
//         //     type: 2
//         // }),
//         success: function (data) {
//             // let templateStr = $("#v-template-lastest-news-template").html();
//             // if (data && data.length > 0) {
//             //     let contentStr = ejs.render(templateStr, {
//             //         list: cloneDeep(data).map(it => {
//             //             const _abstractImg = processAbstractImg(it.abstractImg);
//             //             return {
//             //                 ...it,
//             //                 validStartTime: dayjs(it.validStartTime).format('YYYY-MM-DD'),
//             //                 abstractImg: _abstractImg,
//             //                 updateTime: dayjs(it.updateTime).format('YYYY-MM-DD')
//             //             }
//             //         })
//             //     });
//             //     $('#home-lastest-news-content-2').html(contentStr)
//             // }
//             // if (data && data.content) {
//             //     $('#content_1').html(data.content)
//             // }

//             // $('#content_2').html(JSON.stringify(data))
//         },
//         fail: function (err) {
//             console.log(err)
//         }
//     })
// });





function triggerHeroCarousel() {
    $('.hero-carousel__slides').slick({
        infinite: true,
        autoplay: false,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        appendDots: '.hero-carousel__controls'
    });
}
