Brackets Recent Projects
=======================

Simple extension for Brackets editor which allow user to re-open recently opened projects without using 'Open Folder...' menu.
Current limit is maximum of 5 projects.

Project history is saved in brackets preferences. 

![Recent Projects](https://github.com/technet/brackets.recentprojects/raw/master/screenshot.png)

#### Improvements

* It would be better if we can create nested menu items (cascading). Instead of adding project list directly to the main menu then we could have used sub menu under `File` mennu. [Under Menu](http://brackets.io/docs/current/modules/command/Menus.html) it has mentioned,   

    > _MenuItem represents a single menu item that executes a Command or a menu divider. <b>MenuItems may have a sub-menu</b>. A MenuItem may correspond to an HTML-based menu item or a native menu item if Brackets is running in a native application shell_
    
    However I couldn't find a method to do so. If someone knows please let me know.  


#### Version History

##### 0.2.0

I would like to thank [1951FDG](https://github.com/1951FDG) reviewing my extension and giving valuable feedback. Based on that I fixed the issue of menu item ordering [issue](https://github.com/technet/brackets.recentprojects/issues/1) when you have less than 5 projects in the list and there is another extension which uses file menu to add its menu items. As mentioned above I would like if brackets can support sub menus so we can group menu items properly.

Second point he mentioned is that existing recent project list. I knew about this when I was developing this extension but wanted to have standard way of recent projects under `File` menu. Moreover in-built project menu move up and down when you open may files. I believe menu locations must be static.

