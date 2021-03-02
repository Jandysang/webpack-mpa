import '../../style/push2/index.less'

// function testPromise (){
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             resolve()
//         },2000)
//     })
// }

$('#qrCodeModal').on('show.bs.modal', async function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var id = button.data('id') // Extract info from data-* attributes  
    var modal = $(this)
    modal.find('.modal-footer button.btn-primary').attr('data-id',id)
})

$('#deleteModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var id = button.data('id') 
    var name = button.data('name')// Extract info from data-* attributes
    var modal = $(this)
    modal.find('.modal-footer button.btn-primary').attr('data-id',id)
    modal.find('.modal-body p.h6 span').text(name)
})

$('#deleteSubModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var id = button.data('id') 
    var name = button.data('name')// Extract info from data-* attributes
    var modal = $(this)
    modal.find('.modal-footer button.btn-primary').attr('data-id',id)
    modal.find('.modal-body p.h6 span').text(name)
})