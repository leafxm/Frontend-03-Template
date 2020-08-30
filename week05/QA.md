为什么 first-letter 可以设置 float 之类的，first-line 不行呢？

first-letter作用于第一个字母，是在layout之后，确定了第一个文字之后就可以确定的，设置 float 之类的属性，在当前就可以完成。
first-line需要在绘制完成之后，才能确定第一行的内容，设置 float 之类的属性，会造成页面的重排，first-line 所应用的内容也可能不再是第一行的内容，感觉逻辑会变得混乱，对性能也消耗比较大。