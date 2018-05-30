import shamir from 'sssa-js/sssa'

function S4(){
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};


class Utils {
  GUID() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

  getKeyByValue(obj, value){
    for( var prop in obj ) {
      if( obj.hasOwnProperty( prop ) ) {
        if( obj[ prop ] === value )
          return prop;
      }
    }
  };

  unionArrayObj(array){
    let tmp = {};
    array.forEach(function(it){
      if(JSON.stringify(it) in tmp){
        tmp[JSON.stringify(it)] += 1
      }else{
        tmp[JSON.stringify(it)] = 1
      }
    });

    let tmpVal = Object.values(tmp);
    let max = Math.max(...tmpVal);
    return JSON.parse( this.getKeyByValue(tmp, max));
  };

  unionPartMsg(arrayMsgs){
    //let cnt = arrayMsgs.length;
    /*let parts = arrayMsgs.map(function(x){
      return x.textMsg;
    });*/

    let tetxMsg = shamir.combine(arrayMsgs);
    return tetxMsg;
  }
}

export default new Utils()
