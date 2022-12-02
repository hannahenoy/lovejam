const rubbish = document.getElementsByClassName("fa-trash");

Array.from(rubbish).forEach(function(element) {
    element.addEventListener('click', function(){
      const date = this.parentNode.parentNode.childNodes[1].innerText
      const parentsIntro = this.parentNode.parentNode.childNodes[3].innerText
      const bridalParty = this.parentNode.parentNode.childNodes[5].innerText
      const coupleIntro = this.parentNode.parentNode.childNodes[7].innerText
      const firstDance = this.parentNode.parentNode.childNodes[9].innerText
      const brideDance = this.parentNode.parentNode.childNodes[11].innerText
      const groomDance = this.parentNode.parentNode.childNodes[13].innerText
      const cakeCutting = this.parentNode.parentNode.childNodes[15].innerText
      const lastDance = this.parentNode.parentNode.childNodes[17].innerText
      const msg = this.parentNode.parentNode.childNodes[19].innerText

      fetch('deleteSubmission', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'date': date,
          'parentsIntro': parentsIntro,
          'bridalParty': bridalParty,
          'coupleIntro': coupleIntro,
          'firstDance': firstDance,
          'brideDance': brideDance,
          'groomDance': groomDance,
          'cakeCutting': cakeCutting,
          'lastDance': lastDance,
          'msg':msg,
        })
      }).then(function (response) {
        window.location.reload()
      })
    });
});
