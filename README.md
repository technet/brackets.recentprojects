Brackets Recent Projects
=======================

Simple extension for Brackets editor which allow user to re-open recently opened projects without using 'Open Folder...' menu.
Current limit is maximum of 5 projects.

Project history is saved in brackets preferences. 

![Recent Projects](https://github.com/technet/brackets.recentprojects/raw/master/screenshot.png)

#### Improvements

* It would be better if we can create nested menu items (cascading). Instead of adding project list directly to the main menu then we could have used sub menu under `File` mennu. [Under Menu](http://brackets.io/docs/current/modules/command/Menus.html) it has mentioned,   

    > _MenuItem represents a single menu item that executes a Command or a menu divider. __MenuItems may have a sub-menu__. A MenuItem may correspond to an HTML-based menu item or a native menu item if Brackets is running in a native application shell_    
    
    However I couldn't find a method to do so. If someone knows please let me know.  



