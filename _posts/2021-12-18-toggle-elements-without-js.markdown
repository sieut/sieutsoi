---
layout: post
title:  "Toggle Elements without Javascript"
date:   2021-12-18 22:23:00 -0800
author: Sieu Tsoi
description: Toggle HTML elements without Javascript
---

<style>
.example {
    background-color: #1A1F35;
    border-radius: 0.5em;
    padding-left: 0.75em;
}
</style>

# Introduction
I've been spending my time building a forum where the frontend is only HTML and CSS. The inspiration is from the recent trend of projects hosting their discussions on Discord, which is great for real-time, short discussions, but not for ones with details and worth indexing for future searches. And Javascript frameworks are taking over the web, I thought it would be a nice challenge to build something without Javascript, and forums shouldn't need fancy Javascript to work.

Along the way, I wanted to make a "Reply" button that would toggle a reply form to a discussion. I can make it a link to a separate page, but that would disrupt users as it takes the discussion away from them.

After searching the internet for a bit, I found that this is possible using only CSS, so I want to write this down as I thought it was pretty cool. Please note this is not my idea, I just want to share this finding.

# CSS Selectors
Since I started programming, I've only needed to use some simple selectors like sibling (`~`), child (`>`), hover (`:hover`), etc. But they are so much more powerful than that.

One particularly useful selector is `:checked`, which selects checked input elements. This allows us to use checkboxes as the state storage to toggle an element.

```html
<style>
#state:checked ~ #content {
    display: inline-block;
}
#state:not(checked) ~ #content {
    display: none;
}
</style>

<input id="state" type="checkbox" />

<span id="content">
    Hello there!
</span>
```

Which would result in this:


<div class="example">
    <style>
    #state:checked ~ #content {
        display: inline-block;
    }
    #state:not(checked) ~ #content {
        display: none;
    }

    #content {
        color: #66cccc;
    }
    </style>

    <input id="state" type="checkbox" />

    <span id="content">
        Hello there!
    </span>
</div>

Now that checkbox doesn't really pass as a button. But we can use a `<label>` for that instead. And, to my surprise, an invisible checkbox can still be checked. So our code would turn into

```html
<style>
#state {
    display: none;
}
#state:checked ~ #content {
    display: inline-block;
}
#state:not(checked) ~ #content {
    display: none;
}
</style>

<input id="state" type="checkbox" />
<label id="button" for="state">Click me!</labe>

<span id="content">
    Hello there!
</span>
```

And here is the code in action:

<div class="example">
    <style>
    #state2 {
        display: none;
    }
    #state2:checked ~ #content2 {
        display: inline-block;
    }
    #state2:not(checked) ~ #content2 {
        display: none;
    }

    #content2 {
        color: #66cccc;
    }

    #button {
        user-select: none;
        background-color: #99cc99;
        padding: 0.2em 0.4em;
        border-radius: 0.2em;
        cursor: pointer;
    }
    #button:hover {
        background-color: #77aa77;
    }
    </style>

    <input id="state2" type="checkbox" />
    <label id="button" for="state2">Click me!</label>

    <span id="content2">
        Hello there!
    </span>
</div>

That's it!
