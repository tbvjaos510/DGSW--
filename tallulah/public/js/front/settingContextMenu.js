$(function () {
    $.contextMenu({
        selector: '[project_ident]',
        callback: function (key, options) {
            if (key == "add") {
                var name = prompt("생성할 파일의 이름");
                if (!(name == null || name == "")) {
                    $.ajax({
                        url: "file/create",
                        data: {
                            pident: $(this).attr("project_ident"),
                            name: name
                        },
                        method: "POST",
                        success: function (result) {
                            if (result.success)
                                tree.addFile(result.file);
                            chat.emit('change');
                            alert(result.message);
                        }
                    });
                }
            } else if (key == "addDir") {
                var name = prompt("생성할 디렉터리 이름");
                if (!(name == null || name == "")) {
                    $.ajax({
                        url: "directory/create",
                        data: {
                            dirName: name,
                            ident: $(this).attr("project_ident")
                        },
                        method: "POST",
                        success: function (result) {
                            if (result.success)
                                tree.addDir(result.data);
                            chat.emit('change');
                            alert(result.message);

                        }
                    });
                }
            } else if (key == "rename") {
                var name = prompt("바꿀 프로젝트 이름");
                var desc = prompt("바꿀 프로젝트 설명(미입력시 원래 설명이 유지됩니다.)");

                var this1 = this;
                if (!(name == null || name == "")) {
                    console.log($.ajax({
                        url: "project/update",
                        data: (function () {
                            console.log({
                                ident: $(this1).attr("project_ident"),
                                name: name
                            });
                            if (desc == "" || desc == null)
                                return {
                                    ident: $(this1).attr("project_ident"),
                                    name: name
                                };
                            return {
                                ident: $(this1).attr("project_ident"),
                                name: name,
                                desc: desc
                            };
                        })(),
                        method: "POST",
                        success: function (result) {
                            if (result.success) {
                                $(this1).children('.tree-title').html(name);
                            }

                            chat.emit('change');
                            alert(result.message);
                        }
                    }));
                }
                var projects = $.ajax({
                    url: "project/get",
                    method: "POST",
                    async: false
                }).responseJSON.data;
                //채팅창 뿌리기
                $(".chat-list>ul>li").remove();
                for (var i = 0; i < projects.length; i++) {
                    var project = projects[i];
                    var li = $("<li />");
                    li.html(project.project_name);
                    $(".chat-list>ul").append(li);
                    console.log("test");
                }
            } else if (key == "delete") {
                $.ajax({
                    url: "project/delete",
                    method: "POST",
                    data: {
                        ident: $(this).attr("project_ident")
                    },
                    success: function (result) {
                        chat.emit('change');
                        alert(result.message);

                    }
                });
                $(this).remove();
                var projects = $.ajax({
                    url: "project/get",
                    method: "POST",
                    async: false
                }).responseJSON.data;
                //채팅창 뿌리기
                $(".chat-list>ul>li").remove();
                for (var i = 0; i < projects.length; i++) {
                    var project = projects[i];
                    var li = $("<li />");
                    li.html(project.project_name);
                    $(".chat-list>ul").append(li);
                    console.log("test");
                }
            } else if (key == "invite") {
                var id = prompt("초대할 사람의 아이디를 입력하세요");
                var this1 = this;
                if (!(id == "" || id == null)) {
                    $.ajax({
                        url: "project/invite",
                        method: "POST",
                        data: {
                            pid: $(this1).attr("project_ident"),
                            userid: id
                        },
                        success: function (result) {
                            chat.emit('change');
                            alert(result.message);
                        }
                    });
                }
            } else if (key == "leave") {
                $.ajax({
                    url: "project/leave",
                    data: {
                        pident: $(this).attr("project_ident")
                    },
                    method: "POST",
                    success: function (result) {
                        if (result.success)
                            tree.makeDefault();
                        alert(result.message);
                    }
                });
            } else if (key == "export") {
                var pid = $(this).attr("project_ident")
                $.ajax({
                    url: "project/getZip",
                    data: {
                        pid: pid
                    },
                    method: "POST",
                    success: function (result) {
                        if (result.success) {
                            var iframe = document.createElement("iframe");
                            iframe.setAttribute("src", "project/getZip");
                            iframe.setAttribute("style", "display: none");
                            document.body.appendChild(iframe);
                        }
                    }
                });
            }
        },
        items: {
            "add": {
                name: "AddFile",
                icon: "add"
            },
            "addDir": {
                name: "AddDir",
                icon: "add"
            },
            "rename": {
                name: "rename",
                icon: "edit"
            },
            "delete": {
                name: "Delete",
                icon: "delete"
            },
            "sep1": "-",
            "invite": {
                name: "Invite Other",
                icon: "add"
            },
            "leave": {
                name: "Leave Project",
                icon: "quit"
            },
            "export": {
                name: "Export Project"
            }
        }
    });

    $.contextMenu({
        selector: '[dir_ident]',
        callback: function (key, options) {
            if (key == "add") {
                var name = prompt("생성할 파일의 이름");
                if (!(name == null || name == "")) {
                    $.ajax({
                        url: "file/create",
                        data: {
                            pident: $(this).attr("parent_project"),
                            ident: $(this).attr("dir_ident"),
                            name: name
                        },
                        method: "POST",
                        success: function (result) {

                            chat.emit('change');
                            if (result.success)
                                tree.addFile(result.file);
                            alert(result.message);
                        }
                    });
                }
            } else if (key == "addDir") {
                var name = prompt("생성할 디렉터리 이름");
                if (!(name == null || name == "")) {
                    $.ajax({
                        url: "directory/create",
                        data: {
                            dirName: name,
                            ident: $(this).attr("parent_project"),
                            dirident: $(this).attr("dir_ident")
                        },
                        method: "POST",
                        success: function (result) {

                            chat.emit('change');
                            if (result.success)
                                tree.addDir(result.data);
                            alert(result.message);
                        }
                    });
                }
            } else if (key == "rename") {
                var name = prompt("바꿀 이름");
                var this1 = this;
                if (!(name == null && name == "")) {
                    $.ajax({
                        url: "directory/update",
                        method: "POST",
                        data: {
                            ident: $(this1).attr("dir_ident"),
                            dirName: name
                        },
                        success: function (result) {

                            chat.emit('change');
                            if (result.success) {
                                $(this1).children('.tree-title').html(name);
                            }
                            alert(result.message);
                        }
                    });
                }
            } else if (key == "delete") {
                $.ajax({
                    url: "directory/delete",
                    method: "POST",
                    data: {
                        ident: $(this).attr("dir_ident")
                    },
                    success: function (result) {

                        chat.emit('change');
                        if (result.success) {
                            $(this).remove();
                        }
                        alert(result.message);
                    }
                });
            }
        },
        items: {
            "add": {
                name: "AddFile",
                icon: "add"
            },
            "addDir": {
                name: "AddDir",
                icon: "add"
            },
            "rename": {
                name: "rename",
                icon: "edit"
            },
            "delete": {
                name: "Delete",
                icon: "delete"
            }
        }
    });

    $.contextMenu({
        selector: '[file_ident]',
        callback: function (key, options) {
            if (key == 'rename') {
                var name = prompt('바꿀 이름');
                var this1 = this;
                if (!(name == null && name == "")) {
                    $.ajax({
                        url: "file/updateFileName",
                        method: "POST",
                        data: {
                            ident: $(this1).attr("file_ident"),
                            fileName: name
                        },
                        success: function (result) {
                            if (result.success) {
                                $(this1).children('.tree-title').html(name);
                            }
                            alert(result.message);
                        }
                    });
                }
            } else if (key == 'delete') {
                $.ajax({
                    url: "file/delete",
                    method: "POST",
                    data: {
                        ident: $(this).attr("file_ident")
                    },
                    success: function (result) {
                        if (result.success) {
                            chat.emit('change');
                            $(this).remove();
                        }
                        alert(result.message);
                    }
                });
            }
        },
        items: {
            "rename": {
                name: "rename",
                icon: "edit"
            },
            "delete": {
                name: "Delete",
                icon: "delete"
            }
        }
    });


    $.contextMenu({
        selector: '.nav',
        callback: function (key, options) {
            if (key == 'create Project') {
                tree._addProject();
            }
        },
        items: {
            "create Project": {
                name: "create Project",
                icon: "product-hunt"
            },
        }
    });

});