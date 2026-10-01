---
title: FAQs
description: "Answers to common questions about Cabbage 3, and fixes for the problems people run into most."
---

## Troubleshooting

<details>
<summary>
I can't see any interface when I compile an instrument from my .csd file in VS Code?
</summary> 
<p>When the VS Code extension compiles an instrument for the first time, it attempts to create a new <code>settings.json</code> file. This file is read by the Cabbage service application running in the background. It includes a path to several <code>.js</code> files required for parsing the Cabbage section of the <code>.csd</code> file. If this path is empty, the UI will not appear. The easiest fix is to use the 'Reset CabbageApp settings file' command to clear the file. The next time you compile an instrument, the UI should load correctly.</p> 
</details> 


<details> 
<summary>
My plugin loads fine, but my custom UI is unresponsive?
</summary> 
<p>The most common cause of this issue is an error in your JavaScript code. If the plugin's UI is unresponsive, you won't be able to open the developer tools, making debugging more challenging. The simplest solution is to comment out portions of your code incrementally. Start by commenting out widgets in the Cabbage section of your <code>.csd</code> file to identify the widget causing the issue. Once identified, review the corresponding <code>.js</code> file. Comment out larger chunks of code initially. If the UI becomes responsive, albeit without full functionality, start uncommenting sections gradually until you pinpoint the error in your code.</p> 
</details>

<details> 
<summary> 
Something is wrong but I don't know what? 
</summary> 
<p>If something is not working as expected, you should enable the <code>verbose logging</code> setting in the extension settings. This will generate an extension log of messages in the Cabbage output console, which may help diagnose the issue. Additionally, you can launch the developer web tools panel via the command palette. The Cabbage UI in VS Code is a web panel—essentially an embedded web page. The developer console allows you to inspect elements and review the console log for errors. Both of these features should help you identify the problem. Once you’ve pinpointed the issue, you can post the logs and relevant information to the Cabbage user forum for further assistance.</p> 
</details>

## About Cabbage

<details>
<summary>
Who makes Cabbage?
</summary>
<p>Cabbage is developed by Rory Walsh. You can reach him, and other Cabbage users, on the <a href="https://forum.cabbageaudio.com/">forum</a>.</p>
</details>

<!-- TODO(G): the next answer touches on licence terms. Confirm it with Rory before launch. It says no more than the Home page does. -->
<details>
<summary>
Can I sell plugins made with Cabbage?
</summary>
<p>Instruments you build with Cabbage are yours to distribute and sell. In a standard export, end users can read your Csound code. If you need to ship it encrypted, Cabbage Pro adds protected exports. Message rorywalsh on the <a href="https://forum.cabbageaudio.com/">forum</a> for details.</p>
</details>

<details>
<summary>
Do I need to know Csound?
</summary>
<p>Yes, if you want to write your own instruments. A Cabbage instrument is written in Csound, and its interface talks to that code through named channels. Lessons 3 to 6 of the <a href="/learn/">videos</a> cover the basics of Csound 7, and <a href="/docs/using/csound7/">Csound 7</a> lists what is new in the language.</p>
</details>

<details>
<summary>
Why Csound?
</summary>
<p>Csound is one of the oldest and most extensive audio programming languages, and it is still actively developed. Cabbage 3 is built on Csound 7, its latest major release.</p>
</details>

<!-- TODO(G): MIT is used for now. Confirm the licence with Rory before launch. -->
<details>
<summary>
Where is the source code?
</summary>
<p>The Cabbage extension for VS Code is developed in the open on <a href="https://github.com/rorywalsh/vscabbage">GitHub</a>. Cabbage 3 is open source, released under the MIT licence.</p>
</details>
