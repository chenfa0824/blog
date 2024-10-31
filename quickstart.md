博客
https://docsify.js.org/#/zh-cn/quickstart

https://blog.csdn.net/qq_62982856/article/details/129940209
https://blog.csdn.net/liyou123456789/article/details/124504727
https://www.jianshu.com/p/91f7a87301df
初始化项目
docsify init
启动项目
docsify serve

[使用git生成SSH公钥，并设置SSH公钥](https://blog.csdn.net/m0_64284147/article/details/139159980)
[手把手教你GitHub 配置 SSH密钥](https://blog.csdn.net/KRzzZzz/article/details/140536430)
git 提交到远程仓库
要将本地的更改提交到远程仓库，你需要执行以下步骤：
初始化本地仓库（如果尚未完成）：
git init
添加文件到暂存区：
git add .
提交更改到本地仓库：
git commit -m "Your commit message"
添加远程仓库地址（如果尚未添加）：
git remote add origin <remote_repository_URL>
将本地的更改推送到远程仓库：
git push -u origin master
如果你是第一次推送到远程仓库，并且远程仓库不为空（比如有README.md），你可能需要先拉取远程仓库的更改：
git pull origin master
然后解决可能出现的合并冲突，再次提交并推送。
注意：如果你使用的是其他分支而不是master分支，请将master替换为相应的分支名。


git clone https://github.com/chenfa0824/1031.git
git add . （注：别忘记后面的.，此操作是把Test文件夹下面的文件都添加进来）
git commit -m "commit test" （注：“提交信息”里面换成你需要，如“first commit”）
git push -u origin main（注：此操作目的是把本地仓库push到github上面，此步骤需要你输入帐号和密码）
                   
原文链接：https://blog.csdn.net/xinnian_yyds/article/details/140573059

