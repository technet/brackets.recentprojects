// This is simple extension to remember recently open projects and make it easy to access them again from File menu.
// Author: technetlk@gmail.com (https://github.com/technet/brackets.recentprojects, http://tutewall.com)

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, */
/*global define, brackets, $, _ */
define(function (require, exports, module) {
    'use strict';

    // Using new logic as in in-built extension
    // https://github.com/adobe/brackets/blob/master/src/extensions/default/RecentProjects/main.js
    // PreferencesManager.getViewState("recentProjects") this will return recent project list...
    // Constansts
    var EXT_NAME                    = "technet.recentprojects",
        EXT_MAX_MENU_ITEMS          = 5,
        EXT_MAX_MENU_FOLDER_LENGTH  = 20,
        EXT_PREF_HISTORY            = "history";

    // Importing required modules
    var CommandManager              = brackets.getModule("command/CommandManager"),
        Menus                       = brackets.getModule("command/Menus"),
        AppInit                     = brackets.getModule("utils/AppInit"),
        ProjectManager              = brackets.getModule("project/ProjectManager"),
        PreferencesManager          = brackets.getModule("preferences/PreferencesManager"),
        FileUtils                   = brackets.getModule("file/FileUtils"),
        prefs                       = PreferencesManager.getExtensionPrefs(EXT_NAME);       // We need this in next release to remove any project history we have saved in preferences.
    

    // Commands Ids
    var COMMAND_RECENT_PRJ = EXT_NAME + ".openrecentproject-";
    
    // Module variables
    var currentMenuIds              = [],
        menuDividerStartId          = null,
        menuDividerEndId            = null,
        lastMenuId                  = null;

    // This is taken from (https://github.com/adobe/brackets/blob/master/src/extensions/default/RecentProjects/main.js#L337)
    function parsePath(path) {
        var lastSlash = path.lastIndexOf("/"), folder, rest;
        if (lastSlash === path.length - 1) {
            lastSlash = path.slice(0, path.length - 1).lastIndexOf("/");
        }
        if (lastSlash >= 0) {
            rest = " - " + (lastSlash ? path.slice(0, lastSlash) : "/");
            folder = path.slice(lastSlash + 1);
        } else {
            rest = "/";
            folder = path;
        }

        return {path: path, folder: folder, rest: rest};
    }
    
    // This function to be changed either to use prefs or local file on disk
    function getRecentProjectList() {
        // We will use brackets inbuilt recent project list instead of our own.
        var recentProjects = PreferencesManager.getViewState("recentProjects") || [],
            requiredProjects = [],
            i;

        // We don't need the top most project as it is the one currently user working on..
        // Following part taken from (https://github.com/adobe/brackets/blob/master/src/extensions/default/RecentProjects/main.js#L66)
        for (i = 1; i < recentProjects.length && i <= EXT_MAX_MENU_ITEMS; i++) {
            // We have to canonicalize & then de-canonicalize the path here, since our pref format uses no trailing "/"
            requiredProjects[i - 1] = parsePath(FileUtils.stripTrailingSlash(ProjectManager.updateWelcomeProjectPath(recentProjects[i] + "/")));
        }

        return requiredProjects;
    }
    
    function openRecentProjectEventHandler() {
        var commandId = this.getID();
        var historyId = parseInt(commandId.substr(commandId.lastIndexOf('-') + 1), 10);
        
        var prjList = getRecentProjectList();
        if (prjList !== undefined && prjList.length > historyId) {
            var prjPath = prjList[historyId].path;
            ProjectManager.openProject(prjPath);
        }
    }

    function buildRecentProjectMenuItems() {
        currentMenuIds = [];
        var prjList = getRecentProjectList();
        if (prjList === undefined || prjList.length === 0) {
            return;  // Nothing to build.
        }
        
        var fileMenu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
        
        if (menuDividerStartId === null) {
            var startDividerMenuItem = fileMenu.addMenuDivider();
            menuDividerStartId = startDividerMenuItem.id;
        }
        
        var i = 0;
        for (i = 0; i < prjList.length; i++) {
            if (i > EXT_MAX_MENU_ITEMS) {
                return;
            }
            var project = prjList[i];
            var menuName = project.folder + " [" + project.path.slice(0, EXT_MAX_MENU_FOLDER_LENGTH) + (project.path.length > EXT_MAX_MENU_FOLDER_LENGTH ? "..." : "") + "]";
            var commandId = COMMAND_RECENT_PRJ + i.toString();
            currentMenuIds.push(commandId);
            
            var existingCommand = CommandManager.get(commandId);
            if (existingCommand === undefined) {
                CommandManager.register(menuName, commandId, openRecentProjectEventHandler);
                if (lastMenuId === null) {
                    fileMenu.addMenuItem(commandId);
                } else {
                    fileMenu.addMenuItem(commandId, null, Menus.AFTER, lastMenuId);
                }
                lastMenuId = commandId;
            } else {
                existingCommand.setName(menuName);
            }
        }

        /*
        if (menuDividerEndId === null) {
            var endDividerMenuItem = fileMenu.addMenuDivider();
            menuDividerEndId = endDividerMenuItem.id;
        }
        */
    }

    function clearCurrentMenuItems() {
        var fileMenu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);

        var i = 0;
        for (i = 0; i < currentMenuIds.length; i++) {
            //Menus.removeMenuItem()
            var menuItem = fileMenu.removeMenuItem(currentMenuIds[i]);
        }
    }

    function afterProjectOpenEventHandler(e) {

        buildRecentProjectMenuItems();
    }

    // This function will be removed from next version,  assuming it has cleard any existing preferences.
    function removePreviousVersionPref() {
        var history = prefs.get(EXT_PREF_HISTORY);
        if (history && history.length > 0) {
            prefs.set(EXT_PREF_HISTORY, []);
            prefs.save();
        }
    }

    AppInit.appReady(function () {
        
        $(ProjectManager).on('projectOpen', afterProjectOpenEventHandler);
        removePreviousVersionPref();
        buildRecentProjectMenuItems();
    });
});
