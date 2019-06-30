//cart constructor for creating a new cart for every user or session
module.exports=function cart(oldCart){
    this.items=oldCart.items||{};
    this.totalQty=oldCart.totalQty||0;
    this.totalPrice=oldCart.totalPrice||0;

    this.add=function(item,id){
        var storedItem=this.items[id];
        if(!storedItem){
            storedItem=this.items[id]={item:item,qty:0,price:0}
        }
        storedItem.qty+=1;
    
        storedItem.price=storedItem.item.price*storedItem.qty;
        this.totalQty+=1;
        this.totalPrice+=storedItem.item.price;
    };
    this.reduceByOne=function(id){
        console.log('called reduce')
        this.items[id].qty--;
        this.items[id].price-=this.items[id].item.price;
        this.totalQty--;
        this.totalPrice-=this.items[id].item.price;
        if(this.items[id].qty<=0){
            delete this.items[id]
        }
    }
    this.remove=function(id){
        this.totalPrice-=this.items[id].price;
        this.totalQty-=this.items[id].qty;
        delete this.items[id];
    }

    this.generateArray=function(){
        var arr=[];
        
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr
    }
}