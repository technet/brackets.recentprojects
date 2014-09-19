// This is simple extension to remember recently open projects and make it easy to access them again from File menu.
// Author: technetlk@gmail.com (https://github.com/technet/brackets.recentprojects, http://tutewall.com)

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, _ */
define(function (require, exports, module) {
    'use strict';

    // Constansts
    var EXT_NAME                    = "technet.recentprojects",
        EXT_DATA_FOLDER             = "data",
        EXT_MAX_MENU_ITEMS          = 5,
        EXT_MAX_HISTORY_ITEMS       = 5,
        EXT_MAX_MENU_FOLDER_LENGTH  = 20,
        EXT_PREF_HISTORY            = "history";

    // Importing required modules
    var CommandManager              = brackets.getModule("command/CommandManager"),
        Menus                       = brackets.getModule("command/Menus"),
        AppInit                     = brackets.getModule("utils/AppInit"),
        ProjectManager              = brackets.getModule("project/ProjectManager"),
        PreferencesManager          = brackets.getModule("preferences/PreferencesManager"),
        Directory                   = brackets.getModule("filesystem/Directory"),
        FileUtils                   = brackets.getModule("file/FileUtils"),
        prefs                       = PreferencesManager.getExtensionPrefs(EXT_NAME);
    

    // Commands Ids
    var COMMAND_RECENT_PRJ = EXT_NAME + ".openrecentproject-";
    
    // Module variables
    var currentMenuIds              = [],
        menuDividerId               = null;

    // This function to be changed either to use prefs or local file on disk
    function getRecentProjectList() {
        return prefs.get(EXT_PREF_HISTORY);
    }
    
    // This function to be changed either to use prefs or local file on disk
    function saveRecentProjectList(prjList) {
        prefs.set(EXT_PREF_HISTORY, prjList);
        prefs.save();
    }
    
    function openRecentProjectEventHandler() {
        var commandId = this.getID();
        var historyId = parseInt(commandId.substr(commandId.lastIndexOf('-') + 1));
        
        var prjList = getRecentProjectList();
        if (prjList !== undefined && prjList.length > historyId) {
            var prjPath = prjList[historyId].path;
            ProjectManager.openProject(prjPath);
        }
    }
    

    function saveToHistory(name, path) {
        var prjList = getRecentProjectList();
        var project = {name: name, path: path};
        if (prjList === undefined) {
            prjList = [project];
        } else {
            // If we have this path already then remove it first.
            var foundIndex = -1;
            var i = 0;
            for (i = 0; i < prjList.length; i++) {
                if (prjList[i].path === path) {
                    foundIndex = i;
                    break;
                }
            }
            
            if (foundIndex > -1) {
                prjList.splice(foundIndex, 1);
            }
        
            if (prjList.length >= EXT_MAX_HISTORY_ITEMS) {        // We need to limit, so remove last item first.
                prjList.pop();
            }
            prjList.unshift(project);
        }
        
        saveRecentProjectList(prjList);
    }
    
    function findWorkingDir() {
        var extPath = FileUtils.getNativeModuleDirectoryPath(module);
        var extDataPath = extPath + "/" + EXT_NAME + "/" + EXT_DATA_FOLDER;
    }
    
    function buildRecentProjectMenuItems() {
        currentMenuIds = [];
        var prjList = getRecentProjectList();
        if (prjList === undefined) {
            return;  // Nothing to build.
        }
        
        var fileMenu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
        
        if (menuDividerId === null) {
            var dividerMenuItem = fileMenu.addMenuDivider();
            menuDividerId = dividerMenuItem.id;
        }
        
        var i = 0;
        for (i = 0; i < prjList.length; i++) {
            if (i > EXT_MAX_MENU_ITEMS) {
                return;
            }
            var project = prjList[i];
            var menuName = project.name + " [" + project.path.slice(0, EXT_MAX_MENU_FOLDER_LENGTH) + (project.path.length > EXT_MAX_MENU_FOLDER_LENGTH ? "..." : "") + "]";
            var commandId = COMMAND_RECENT_PRJ + i.toString();
            currentMenuIds.push(commandId);
            
            var existingCommand = CommandManager.get(commandId);
            if (existingCommand === undefined) {
                CommandManager.register(menuName, commandId, openRecentProjectEventHandler);
                fileMenu.addMenuItem(commandId);
            } else {
                existingCommand.setName(menuName);
            }
        }
    }

    function beforeProjectCloseEventHandler(e) {
        try {
            var projectRoot = e.currentTarget.getProjectRoot();
            if (projectRoot !== null && projectRoot._isDirectory) {
                var projectName = projectRoot.name;
                var projectPath = projectRoot.fullPath;

                saveToHistory(projectName, projectPath);

                //clearCurrentMenuItems();
                buildRecentProjectMenuItems();
            }
        } catch (ex) {
            console.error(ex.toString());
        }
    }

    function clearCurrentMenuItems() {
        var fileMenu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);

        var i = 0;
        for (i = 0; i < currentMenuIds.length; i++) {
            //Menus.removeMenuItem()
            var menuItem = fileMenu.removeMenuItem(currentMenuIds[i]);
        }
    }






    AppInit.appReady(function () {
        
        $(ProjectManager).on('beforeProjectClose', beforeProjectCloseEventHandler);
        
        buildRecentProjectMenuItems();
    });
});
