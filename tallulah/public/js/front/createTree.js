function makeTree(selector) {
    this.selector = selector;
    this.treeCount = 0;
    this.tree = new orangeTree(selector);
}

makeTree.prototype.addPj = function(projectData, descData){
    var projectData = $("input[name='project']").val();
    var descData = $("input[name='project-desc']").val();
    this.tree.addBranch({
        title: projectData,
        folder: true
    });
}

makeTree.prototype.addProject = function (projectData, descData) {
    var projectData = $("input[name='project']").val();
    var descData = $("input[name='project-desc']").val();
    if (!(projectData == null || projectData == '' || descData == null || descData == '')) {
        console.log(projectData);
        this.tree.addBranch({
            folder: true,
            title: projectData
        });

    }
    $.ajax({
        url: "project/create",
        data: {
            name: projectData,
            desc: descData
        },
        method: "POST",
        success: function (res) {
            console.log(res);
            console.log(this.data);
            alert(res.message);
        }
    });
};

makeTree.prototype.makeDefault = function () {
    var this1 = this;
    var projects = $.ajax({
        url: "project/get",
        method: "POST",
        async: false
    }).responseJSON.data;
    for (var i = 0; i < projects.length; i++) {
        var project = projects[i];
        var directorys;
        var files;
        this.tree.addBranch({
            folder: true,
            title: project.project_name
        });
        this.treeCount++;
        $("li[data-id=" + this.treeCount + "]").attr("project_ident", project.project_ident);
        this.addEntity(project.project_ident);
    }
}

makeTree.prototype.addDir = function (dirData) {
    for (var i = 0; i < dirData.length; i++) {
        var dir = dirData[i];
        var this1;
        if (!dir.dir_parent) { //부모가 null, 최상위 파일
            this.tree.addBranch({
                folder: true,
                title: dir.dir_name,
                path: $("li[project_ident=" + dir.project_ident + "]").attr("data-id")
            });
        } else {
            this.tree.addBranch({
                folder: true,
                title: dir.dir_name,
                path: $("li[dir_ident=" + dir.dir_parent + "]").attr("data-id") //부모 폴더의 path를 설정
            });
        }
        this.treeCount++;
        this1 = $("li[data-id=" + this.treeCount + "]");
        this1.attr("dir_ident", dir.dir_ident);
    }
};


makeTree.prototype.addFile = function (fileData) {
    for (var i = 0; i < fileData.length; i++) {
        var file = fileData[i];
        if (!file.dir_ident) {
            this.tree.addBranch({
                title: file.file_name,
                path: $("li[project_ident=" + file.project_ident + "]").attr("data-id"),
                click: changeFile
            });
        } else {
            this.tree.addBranch({
                title: file.file_name,
                path: $("li[dir_ident=" + file.dir_ident + "]").attr("data-id")
            });
        }
        this.treeCount++;
        $("li[data-id=" + this.treeCount + "]").attr("file_ident", file.file_ident);
    }

};

makeTree.prototype.delete = function () {

    for (var i = 0; i < fileData.length; i++) {
        var file = fileData[i];
        if (file.dir_ident == 0) {

        }
    }
};

makeTree.prototype.addEntity=function(project_ident){
    var this1=this;
    $.ajax({
        url: "directory/get",
        data: {
            ident: project_ident
        },
        method: "POST",
        success: function (result) {
            this1.addDir(result);
        }
    }).then(function () {
        $.ajax({
            url: "file/get",
            data: {
                ident: project_ident
            },
            method: "POST",
            success: function (result) {
                this1.addFile(result.data);
            }
        });
    });
}