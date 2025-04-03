function finditem(arr){
    var item=["Banana","Apple","Orange"];
    var index=item.indexOf(arr);
    return "Found "+arr+ " at position " + index;
}
console.log(finditem("Banana"))