export class Queue {  
    static newQueue() {  
        return '1xxxx'.replace(/[xy]/g, function(c) {  
            var r = Math.random()*4|0, v = c == 'x' ? r : (r&0x3|0x8);  
            return v.toString(4);  
        });  
    }  
}