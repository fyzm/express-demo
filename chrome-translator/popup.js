let select = document.querySelector('#select')

chrome.storage.sync.get(['switch'], function(result) {
  console.log('Value currently is ' + result.switch);
  if(result.switch) {
    select.value = result.switch
  }
});



select.onchange = function() {
  console.log(this.value)
  chrome.storage.sync.set({'switch': this.value}, ()=> {
    console.log('Value is set to ' + this.value);
  });  
}