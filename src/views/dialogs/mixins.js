export var RemoveModal = {
    methods: {
      handleRemoveModal(id){
        setTimeout(_=>{
          var element = document.getElementById(id);
          if(element) element.parentNode.removeChild(element);
        },200)
      }
    }
}
