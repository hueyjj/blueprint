# blueprint
blueprint is a mind map that allows the user to create nodes, attach a tag to it, and connect 
them with other nodes. These nodes can also enter into submap.

![Example 1](https://raw.githubusercontent.com/hueyjj/blueprint/master/screenshots/Example1.PNG)
![Example 2](https://raw.githubusercontent.com/hueyjj/blueprint/master/screenshots/Example2.PNG)

    n                               creates a node at the current mouse location
    m                               enters the sub map of the selected node
    b                               return to the parent map 
    
    del,                            deletes the node connection (line drawn between two nodes)
    backspace, 
    ctrl + click    
    
    del,                            deletes the node
    backspace 
    
    ctrl + click                    connects two nodes

    double click the tag to edit the text
    right click the tag to shift the tag location: top, right, bottom, left

# Requirements
  - npm (probably)
  - electron

__note:__ blueprint currently uses no 3rd party node module, which is why npm might not be necessary if electron is already installed.

# Install
```sh
git clone https://github.com/hueyjj/blueprint
cd blueprint
npm install
```

# Running
```sh
npm start
```
or
```sh
electron .
```

