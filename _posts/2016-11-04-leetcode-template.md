---
layout: post
title: Leetcode Template
date: 2016-11-04 19:22:16 +0800
tags:
  - template
  - leetcode
use_require: true
page_script: leetcode_template
---

## Data

<div class="ace-editor" id="src-box">{
  "name": "Problem",
  "time": "%t"
}
</div>

## Result

<div class="ace-editor" id="out-box">{% raw %}{{ fullname }}.md
---
layout: post
title: {{ name }}
date: {{ time }}
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------

Solution
--------

```cpp
```
{% endraw %}</div>
