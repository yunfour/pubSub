#PubSub


这是一个CMD模块，建议使用seajs加载调用该模块提供的功能。该模块抛出了一个JS的类（构造函数），这个类（构造函数）是通过createClass函数创建的，因此其依赖了createClass模块，关于createClass模块的使用请参考：[https://github.com/yunfour/createClass](https://github.com/yunfour/createClass)。在该项目中主模块依赖的其他组件、类库的代码均放到了lib/ 目录下，createClass的代码也不例外。


## 实现原理
PubSub是发布/订阅设计模式的JS实现，该模式目的是通过发布/订阅消息的方式，来对复杂业务进行解耦。如果我们对某个对象的状态比较关心，我就订阅这个对象的消息，当这个目标对象的状态发生变化或进行了某些行为是，这这个变化的消息发布出去，通知那些订阅这个消息对象。上面的这一段话说起来比较抽象，其实，发布/订阅模式就是事件模式，拿个开发中经常遇到的例子：在前端页面中，有一个按钮，当这个按钮上发生单击的行为（事件）时，我们要弹出对话框，此时我们要订阅这个按钮的单击事件，当按钮发生单击事件是，就会通知我们，我们接到通知时弹出一个对话框即可。

当然DOM对于发布/订阅事件有自己的一套API，但是这一套API我们没法直接拿来用，假如说，我们现在要自定义一个组件，这个组件有自己的一套行为，组件发生行为时，我们希望发布消息的方式，将这个信息传递给关心这个行为的对象，此时这个组件就要拥有一套发布/订阅消息的API。举例说：现在我们开发了一个对话框组件，在我们业务代码中使用了这个对话框组件，这个组件具有显示、隐藏、定位的功能，在业务代码中如果发现这个对话框出现这几个行为是，要做出具体的相应，则此时，这个组件就要拥有发布/订阅消息的功能，就是处理事件的能力。

如果我们关注这个的显示行为，我们就需要订阅这个对话框的显示行为的消息，对话框组件显示时会主动触发显示（叫show事件吧），也就是把show行为的消息发布出去，通知到订阅这个消息的对象。从上面描述至少可以提取两个API：1、订阅消息，2、发布消息。如果再根据需求分析，如果如果在某个时刻不想关注目标对象的某个行为了，我需要要取消订阅，这就诞生了第三个API：取消消息订阅。

我们和熟悉jQuery对DOM事件重新封装，针对事件提供了自己的一套好用的API：bind——绑定事件（订阅消息）、trigger——触发事件（发布消息）、unbind——解绑事件（取消消息订阅）。之后jQuery升级后又支持on（多功能，可以绑定或触发事件）、off（取消绑定事件）等API。

在这个模块中实现的发布订阅模式，也是参考了jQuery实现的API而设计的。我们这里通过createClass函数，创建了一个PubSub的类，这个类实现了bind()、trigger()、unbind()、on()、off()、once()这些API，这些API的作用上述已经大致介绍，以下文档中会有详细介绍。

具体的实现的原理，主要过程是在维护对象的一个事件对象，将对应事件的回调函数存储到这个事件对象中。类提供的几个API均是在操作这个事件对象，如：绑定事件的bind()方法，就是将事件的回调函数存储到对应事件的数组序列中，unbind()方法的过程和bind()方法正好相反；trigger()方法则是执行事件对象中对应事件的回调函数，并将数据传递给这些回调函数。


---

## API

该模块抛出了一个构造函数：PubSub，该构造函数是通过createClass()函数（[https://github.com/yunfour/createClass](https://github.com/yunfour/createClass)）创建的，通过createClass()函数创建的构造函数的实例都会拥有：setAttr()、getAttr()、instanceOf()三个方法，这三个方法的作用，请参考https://github.com/yunfour/createClass这个模块的说明。除了这三个方法，该构造函数还提供以下几个方法：

* [trigger\(eventsName, \[arg_a, arg_b ..\]\)](#method-trigger) 触发 eventsName 对应的事件，并将对应的数据\[arg_a, arg_b ..]传入回调函数中
* [bind\(eventName, callback\)](#method-bind 'bind') 添加（绑定/注册/订阅）自定义事件
* [unbind\(\[eventsNane\]\[,callback\]\)](#method-unbind) 移除（取消）自定义事件
* [on\(eventsName, \[callback\]\)](#method-on) 添加/触发 eventsName 对应的事件
* [off\(\[eventsName\], \[callback\]\)](#method-off) 移除 eventsName 对应的事件
* [once\(eventsName, callback\)](#method-once) 添加只会执行一次的自定义事件

### 方法详解


<a id="method-trigger"></a>
#### trigger(eventsName, [arg_a, arg_b ...])

触发实例的 eventsName 的事件，并将数据[arg_a, arg_b ..]传入回调函数。例子同 bind() 方法的例子。

---


<a id="method-bind"></a>
#### bind(eventName, callback)
添加自定义事件，如果某个对象需要发生了某个动作，这个动作发生之后想通知其他对象时，可以使用此方法添加（订阅）此对象的事件。

#### 例子
```js
seajs.use('epay-event', function(Event) {
    
    var eventor = new Event();
    
    eventor.bind('change', function(val) {
        
        console.log(val);
    });
    
    // 触发eventor的 change 事件
    eventor.trigger('change', 'Hello world');  // 输出：Hello world
});
```
---


<a id="method-unbind"></a>
#### unbind([eventsNane][,callback])
移除（取消）绑定的自定义事件，其参数eventsName、callback均为可选参数，其使用方式如下列例子中：

#### 例子
```js
seajs.use('epay-event', function(Event) {
    
    var eventor = new Event();
    
    functoion changeFn(val) {
        
        console.log(val);
    }
    
    eventor.bind('change', changeFn);
    
    eventor.bind('change', function(val) {
        
        alert(val);
    });
    
    eventor.bind('show', function() {
        
        console.log('触发了 show 事件！');
    });
    
    // 使用unbind()方法移除事件change的回调函数changeFn
    eventor.unbind('change', changeFn);
    eventor.trigger('change', 'test');  // 此时删除了change事件的changeFn回调函数，则只有alert弹出：test
    
    
    // 如果没有[,callback]参数，则移除change事件的所有回调函数，如下
    eventor.unbind('change');
    eventor.trigger('change');  // 移除了change事件的所有回调函数，则此时无输出
    
    
    // 如果没有[eventsName][,callback]两个参数，则将移除所有事件的所有回调函数，如下
    eventor.unbind();
    eventor.trigger('change');
    eventor.trigger('show');    // 此时移除了eventor对象的所有事件回调函数，无输出也无弹出
});
```
---


<a id="method-on"></a>
#### on(eventsName, [callback])
on()方法为多功能方法，根据其参数不同，其实现不同的功能：当只设置了eventsName一个参数on(eventsName)时，此时的作用和trigger()方法是一样，触发eventsName对应的事件；如果设置了2个以上（含2个）的参数，且第2个参数为function类型的，此时on()方法的作用相当于bind(evensName, callback)：绑定事件回调函数，如果第二个参数非function类型的，此时on方法相当于trigger(eventsName, arg_a, arg_b ...)：触发eventsName事件并把第一个参数后的所有参数传递给回调函数。具体使用方式，如下列例子：

#### 例子
```js
seajs.use('epay-event', function(Event) {
    
    var eventor = new Event();
    
    // 使用on()方法为事件绑定回调函数
    eventor.on('change', function(val) {
        
        console.log(val);
    });
    
    // 使用on()方法触发事件
    event.on('change'); // 此时输出：undefined
    
    // 使用on()方法触发事件，并将参数传入回调函数中
    event.on('change', 'test'); // 此时输出：test
});
```
---


<a id="method-off"></a>
#### off([eventsName], [callback])
off()方法是unbind()方法的变种，即：移除实例指定事件的回调函数

#### 例子
```js
seajs.use('epay-event', function(Event) {
    
    var eventor = new Event();
    
    // 使用on()方法为事件绑定回调函数
    eventor.on('change', function(val) {
        
        console.log(val);
    });
    
    // 使用off()方法移除change事件的所有回调函数
    eventor.off('change');
    
    // 使用on()方法触发事件，并将参数传入回调函数中
    event.on('change', 'test'); // change事件的回调函数已经移除，此时无任何输出
});
```
---


<a id="method-once"></a>
#### once(eventsName, callback)
once()方法作用是绑定事件的回调函数，但是其和trigger()方法的区别是：通过once()方法绑定事件的回调函数，在触发事件只会调用一次，而trigger()方法绑定的事件回调函数，只要不手动移除，每次触发事件是总会执行。如下例：

#### 例子
```js
seajs.use('epay-event', function(Event) {
    
    var eventor = new Event();
    
    // 使用on()方法为事件绑定回调函数
    eventor.once('change', function(val) {
        
        console.log(val);
    });
    
    // 触发change事件
    eventor.on('change', 'test');   // 此时输出：test
    
    // 再次触发change事件
    event.on('change', 'test');     // 此时无输出，因为通过once()方法绑定的事件回调函数，只能执行一次
});
```
---



## 使用方法

### 直接使用
```js
seajs.use('./dist/pubSub.js', function(PubSub) {
    
    // 直接创建实例，调用其对应的API
    var eventor = new PubSub();
    
    // 订阅eventor对象的show事件
    eventor.bind('show', function() {
        
        console.log('收到了show事件的通知');
    });
    
    // 发布eventor对象的show消息（触发eventor的show事件）
    eventor.trigger('show');
});
```


### 作为父类
```js
seajs.use('./dist/pubSub.js', function(PubSub) {
    /*
     * 也可以将PubSub作为父类，让其子类继承它的API，这样子类就拥有了处理自定
     * 义事件的能力，如下面的例子，定义了Dialog类，这是一个对话框组件，对话框
     * 在发生某些行为时，会发布其对应的消息，通知组件使用者，如：对话框关闭时
     * 会发布对话框关闭的消息，组件使用者接受到关闭的消息时，会做出相应的操作。
     */
    
    var Dialog = createClass({
        
        // 将PubSub设置为Dialog的父类
        superClass: [superClass],
        
        methods: {
            
            // 定义Dialog自身的方法
            
            show: function() {
                
                // 显示对话框
                // 代码省略
                
                // 对话框显示后，会发布对应的消息：触发show事件
                this.trigger('show');
            },
            
            hide: function() {
                
                // 隐藏对话框
                // 代码省略
                
                // 对话框隐藏后，会发布对应的消息：触发hide事件
                this.trigger('hide');
            }
            // 其他方法省略...
        }
    });
    
    // 定义Dialog的实例
    var dialog = new Dialog();
    
    /*
     * 我们现在有一个需求：页面有一个id=btn的按钮，现在dialog显示后，需要隐藏
     * 这个按钮，dialog隐藏后要将这个按钮显示出来，此时我们要订阅dialog的show
     * 和hide消息，btn的单击事件发生时，则取消上面的显示隐藏关系。实现如下：
     */
    var btn = document.getElementById('btn');
    
    dialog.bind('show', function onShow() {
        
        // 收到dialog显示的消息，则将btn隐藏
        btn.style.display = 'none';
    });
    dialog.bind('hide', function onHide() {
        
        // 收到dialog隐藏的消息，则将btn显示
        btn.style.display = 'block';
    });
    
    btn.addEventListener('click', function() {
        
        // btn单击后则将订阅dialog的消息取消
        dialog.unbind('show', onShow);
        dialog.unbind('hide', onHide);
    });
});
```


---



## 总结
以上的描述是我对JS面对对象实现的一些解决方案，也是我对面向对象编程的理解，希望将这些东西总结、分享出来，对别人有帮助，更希望有高手指出其中的问题，学习进步。以上的理论，在createClass模块中都已经实现，并且自己也使用createClass创建了一些相对复杂的组件，之后我会逐渐将这些组件开源分享出来。