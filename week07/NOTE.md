# 重学HTML
## HTML的定义：XML和SGML
[DTD](http://w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd)
实体定义
nbsp问题： 不会换行（这点在最近正好遇到了，打包的时候把空格转换为nbsp导致不换行）

[XML namespace](http://w3.org/1999/xhtml)

## HTML标签语义
aside: 不太重要的
main: 页面主体部分，在整个页面只有一个
article: 文章
h1: 主标题
h2: 副标题
hgroup: 标题组
hr： break，改变故事走向的场景
p: 段落，可以使用class作为语义的补充
abbr：缩写
strong: 强调，表示重要性，不改变语义
em: 强调，表示重音
figure：图像
figcaption: 图像标题
ol, ul, li: 列表, ol和ul的区别是语义上ol表示有顺序
nav: 导航 
dfn：定义
pre: 调整好格式的文本
samp: 示例
code: 代码
header, footer：与主体无关的，在article中也可以有

## HTML语法
Element
Text
Comment
DocumentType
ProcessingInstruction: 预处理语法，很少用
CDATA：特殊语法，不需要转角

### 字符引用
- &#161
- &amp
- &lt
- &quot

# 浏览器API
## DOM API
### 导航类操作
- parentNode   | parentElement
- childNodes   | children
- firstChild   | firstElementChild
- lastChild    | lastElementChild 
- nextSibling  | nextElementSibling
- previousSibling | previousElementSibling

### 修改操作
- appendChild
- insertBefore
- removeChild
- replaceChild

### 高级操作
- compareDocumentPosition：比较节点前后关系
- contains： 一个是否包含另一个
- isEqualNode： 是否完全相同
- isSameNode：是否同一个，可以使用 === 代替
- cloneNode：复制，传true为深度

## 事件API
addEventListener
- type
- listener
- [ optiops ] 
    - capture
    - once
    - passive 高频次事件提升性能，阻止默认事件需要写成false

冒泡与捕获

## Range API
基本
- `var range = new Range()`
- `range.setStart(element, 9)`
- `range.setEnd(element, 4)`
- `var range = document.getSelection().getRangeAt(0)`

选择
-  `range.setStartBefore`
-  `range.setEndBefore`
-  `range.setStartAfter`
-  `range.setEndAfter`
-  `range.selectNode`
-  `range.selectNodeContent`

删除，添加
- `var fragment = range.extractContents()`
- `range.insetNode(document.createTextNod('aa'))`

## CSSOM
document.styleSheets

### Rules
- `document.styleSheets[0].cssRules`
- `document.styleSheets[0].insertRule("p{color:pink;}", 0)`
- `document.styleSheets[0].removeRule(0)`

### getComputedStyle
获取计算值

## CSSOM View
### window
- window.innerWidth, window.innerHeight
- window.outerWidth, window.outerHeight
- window.devicePixelRatio
- window.screen
    - window.screen.width
    - window.screen.height
    - window.screen.availWidth
    - window.screen.availHeight
- window.open
- window.moveTo(x, y)
- window.moveBy(x, y)
- window.resizeTo(x, y)
- window.resizeBy(x, y)

### scroll
- scrollTop
- scrollLeft
- scrollWidth
- scrollHeight
- scroll(x, y)
- scrollBy(x, y)
- scrollIntoView()
- window
    - scrollX
    - scrollY
    - scroll(x, y)
    - scrollBy(x, y)

### layout
- getClientRects()
- getBoundingClientRect()

## 其他API
```
还剩165个
[
    'MediaEncryptedEvent',
    'InputDeviceInfo',
    'DecompressionStream',
    'CompressionStream',
    'CanvasCaptureMediaStreamTrack',
    'BlobEvent',
    'BeforeInstallPromptEvent',
    'BatteryManager',
    'BaseAudioContext',
    'WheelEvent',
    'VisualViewport',
    'VTTCue',
    'UserActivation',
    'UIEvent',
    'TreeWalker',
    'TransitionEvent',
    'TouchList',
    'TouchEvent',
    'Touch',
    'TextEvent',
    'TaskAttributionTiming',
    'SubmitEvent',
    'StyleSheetList',
    'StyleSheet',
    'StylePropertyMapReadOnly',
    'StylePropertyMap',
    'StaticRange',
    'Selection',
    'SecurityPolicyViolationEvent',
    'Screen',
    'Response',
    'ResizeObserverEntry',
    'ResizeObserver',
    'Request',
    'ReportingObserver',
    'ProgressEvent',
    'PointerEvent',
    'NamedNodeMap',
    'MediaQueryListEvent',
    'MediaQueryList',
    'MediaList',
    'LayoutShift',
    'LargestContentfulPaint',
    'KeyframeEffect',
    'IntersectionObserverEntry',
    'IntersectionObserver',
    'InputEvent',
    'InputDeviceCapabilities',
    'IdleDeadline',
    'Headers',
    'HTMLOptionsCollection',
    'HTMLFormControlsCollection',
    'HTMLCollection',
    'FormData',
    'FontFaceSetLoadEvent',
    'FontFace',
    'FocusEvent',
    'FileReader',
    'FileList',
    'File',
    'FeaturePolicy',
    'ElementInternals',
    'CustomEvent',
    'CompositionEvent',
    'ClipboardEvent',
    'CSSPositionValue',
    'CSSFontFaceRule',
    'Blob',
    'AbortSignal',
    'AbortController',
    'origin',
    'external',
    'visualViewport',
    'event',
    'clientInformation',
    'offscreenBuffering',
    'defaultStatus',
    'defaultstatus',
    'styleMedia',
    'isSecureContext',
    'captureEvents',
    'releaseEvents',
    'matchMedia',
    'getSelection',
    'find',
    'btoa',
    'atob',
    'createImageBitmap',
    'AggregateError',
    'FinalizationRegistry',
    'WeakRef',
    'chrome',
    'WebAssembly',
    'FragmentDirective',
    'WakeLock',
    'WakeLockSentinel',
    'CSSPropertyRule',
    'EventCounts',
    'LayoutShiftAttribution',
    'ResizeObserverSize',
    'AnimationPlaybackEvent',
    'AnimationTimeline',
    'CSSAnimation',
    'CSSTransition',
    'DocumentTimeline',
    'XSLTProcessor',
    'trustedTypes',
    'BackgroundFetchManager',
    'BackgroundFetchRecord',
    'BackgroundFetchRegistration',
    'MediaMetadata',
    'MediaSession',
    'Notification',
    'PaymentInstruments',
    'PaymentManager',
    'PeriodicSyncManager',
    'Permissions',
    'PermissionStatus',
    'PictureInPictureEvent',
    'PictureInPictureWindow',
    'PushManager',
    'PushSubscription',
    'PushSubscriptionOptions',
    'RemotePlayback',
    'SpeechSynthesisErrorEvent',
    'SpeechSynthesisEvent',
    'SpeechSynthesisUtterance',
    'VideoPlaybackQuality',
    'BluetoothUUID',
    'speechSynthesis',
    'openDatabase',
    'Worklet',
    'caches',
    'AbsoluteOrientationSensor',
    'Accelerometer',
    'Cache',
    'CacheStorage',
    'Clipboard',
    'Credential',
    'CredentialsContainer',
    'DeviceOrientationEvent',
    'FederatedCredential',
    'Gyroscope',
    'Keyboard',
    'KeyboardLayoutMap',
    'LinearAccelerationSensor',
    'Lock',
    'LockManager',
    'MIDIAccess',
    'MIDIConnectionEvent',
    'MIDIInput',
    'MIDIInputMap',
    'MIDIMessageEvent',
    'MIDIOutput',
    'MIDIOutputMap',
    'MIDIPort',
    'NavigationPreloadManager',
    'OrientationSensor',
    'PasswordCredential',
    'RelativeOrientationSensor',
    'Sensor',
    'SensorErrorEvent',
    'StorageManager',
    'BarcodeDetector',
    'filterOut',
]
```
