# **组件测试-Nacos同步工具**

# 一、Nacos

## 1、快速入门

Nacos 是一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

安装部署方式，下载官方的压缩包后直接启动，详情请参考[官方文档](https://nacos.io/zh-cn/docs/quick-start.html)。

在浏览器输入`http://localhost:8848/nacos`进入Nacos的登录界面，默认端口为8848，默认用户名密码均为nacos

> 用户名：nacos；密码：nacos；登录成功的界面如下：

![img](https://image.z.itpub.net/zitpub.net/JPG/2021-09-09/AA8FE86652AFF491DFAF4285EF42DA99.jpg)

## 2、重要概念

（1）命名空间namesapce

用于进行租户粒度的配置隔离。不同的命名空间下，可以存在相同的 Group 或 Data ID 的配置。Namespace 的常用场景之一是不同环境的配置的区分隔离，例如开发测试环境和生产环境的资源（如配置、服务）隔离等。

（2）Nacos、Provider、Consumer的关系

详情请参考[Dubbo 融合 Nacos 成为注册中心](https://nacos.io/zh-cn/docs/use-nacos-with-dubbo.html) 

如架构图所示，nacos-provider(服务提供者)和nacos-consumer(服务消费者)的职责如下：

- `nacos-provider`：注册进入nacos-server，对外暴露服务
- `nacos-consumer`：注册进入nacos-server，调用nacos-provider的服务

![img](https://image.z.itpub.net/zitpub.net/JPG/2021-09-09/59784EA620CBD8129B41567D78517595.jpg)

启动成功之后将会在nacos中的服务列表中查看到两个服务，分别是nacos-provider、nacos-consumer，如下图：

![img](https://image.z.itpub.net/zitpub.net/JPG/2021-09-09/B9CCFC16C62E977DB76C3A387495C209.jpg)

（3）健康检查

以指定方式检查服务下挂载的实例 (Instance) 的健康度，从而确认该实例 (Instance) 是否能提供服务。根据检查结果，实例 (Instance) 会被判断为健康或不健康。对服务发起解析请求时，不健康的实例 (Instance) 不会返回给客户端。

## 3、OpenAPI 

更多详情请参考[Nacos-OpenAPI官方手册](https://nacos.io/zh-cn/docs/open-api.html)

# 二、Nacos同步工具

## 1、基本背景

目前内部系统间调用，当某个服务域中的所有服务提供方都异常时，请求方无法获取响应，无法保证服务的高可用。而此时其他服务域中存在可用的服务提供方，因此考虑在某个服务域中所有服务提供方出现问题时，能调用其余可用服务域中的服务提供方来提高服务的可用性。当不同服务域的服务注册在不同的nacos集群上，可以通过nacos同步组件同步不同服务域中nacos集群的数据，使每个服务域的nacos集群中注册所有的服务端实例，当本服务域服务端出现异常时，由客户端集成的sdk决定转发到其余服务域的服务端。

由于NacosSync需要一直提供同步服务，所以需要满足高可用架构，集群部署。

![image-20231117102333607](C:\Users\96549\AppData\Roaming\Typora\typora-user-images\image-20231117102333607.png)

## 2、NacosSync服务架构与同步原理

Nacos Sync 是一个支持多种注册中心的同步组件，基于 SpringBoot 开发框架，数据层采用 Spring Data JPA，遵循了标准的 JPA 访问规范，支持多种数据源存储，默认使用 Hibernate 实现，更加方便的支持表的自动创建更新。公司标准组件室在原生开源的基础上对Nacos Sync进行二次开发，下图是 Nacos Sync 目前的系统架构图

![image-20231117154622559](组件测试-Nacos同步工具.assets/image-20231117154622559.png)

**Web Console:** 提供给用户进行注册中心和同步任务进行相关界面操作

**Processor Frame:** 注册中心和任务的业务处理逻辑

**Timer Manager:** 定时轮询数据库获取同步任务进行处理

**Event Frame:** 异步事件来进行同步任务的同步以及删除

**Extension:** 对接各种注册中心客户端的扩展实现

调用流程

通过 Web 控制台添加相关注册中心，一般都必须配置两个注册中心，一个源注册中心，另外一个是目标注册中心，注册中心相关数据会写入到数据库；

1. 添加完注册中心以后，增加一个同步任务，添加需要同步的服务
2. Nacos Sync 会每隔 3s 从数据库捞取同步任务，并通过异步事件的方式进行发布；
3. 同步服务管理监听到定时任务发布的的事件，目前有同步/删除这两种事件；
4. 同步服务管理根据不同的策略选择相关的同步服务进行真正同步逻辑处理；

## 3、同步任务策略

考虑到NacosSync同步工具使用场景的多元化，对于实例同步策略上支持如下四种同步：

### （1）全量同步

同步策略：full

单个namespace下全部实例的同步策略， 不针对具体的服务实例，采用*-+服务名的方式同步ns下的全部实例。

例如：*-avsc-front

### （2）前缀同步

同步策略:prefix

针对某类服务实例，采用前缀匹配的方式同步服务实例。

例如：providers:com.chinaums.vs.cache.api.*

### （3）枚举同步

同步策略: enum

某几个服务实例的同步策略，对具体的几个服务实例，采用逗号分割的方式同步服务实例。

例如：providers:com.chinaums.vs.api.CertApiCache,providers:com.chinaums.vs.api.TradeService

### （4）单个同步

同步策略: single

只同步某一个服务

例如：providers:com.chinaums.vs.api.CertApiCache

## 4、地址转换策略

由于位于上海的服务访问武汉的服务时，武汉的地址需要做转换成上海的地址段，所以当武汉的实例通过nacosSync同步到上海时，武汉的实例地址不能直接拿来使用，需要在同步过程中做地址转换然后在进行注册。考虑到地址转换策略可以适配多种场景，我们既可以配置1对1固定的ip地址转换规则，同时也可以批量按照某种规则做转换，因此考虑如下3种转换策略，并配置优先级。

### （1）绝对转换

例如：配置10.11.51.118:9876转换成10.128.251.46:9876，这种策略意味着需要配置大量的转换规则，看注册实例而定。

### （2）相对转换

例如：配置10.11.51.*转换成10.128.251.*，即*位保持不变，这种策略意味着需要在打通网络上要有一定的规律，网络转换时除ip前缀外保持不变。

### （3）表达式转换

例如：配置10.11.*.*转换成表达式，即10.11类似确定位匹配到后，用表达式动态生成其余位。

说明：对于以上三种转换策略每一种策略还对应了一个优先级，优先级大（数字越小的优先级越大）的策略提前执行，如果匹配不上则顺延到较小的优先级策略，直到三种策略都匹配不到，则走源地址。

## 5、同步原则

### （1）**目的就近原则**

针对跨idc同步的场景，同步任务所在同步组件的选取由目的端决定，例如当从上海同步到武汉时，同步任务创建在武汉的同步组件上。这样对于心跳保持来讲可以降低跨区造成的网络方面的影响。

### （2）**单一源原则**

同步组件支持多段同步，但需要尽量避免多段同步，降低同步上下游关系的复杂度，方便后续同步拓扑图的梳理。例如当vs的服务要同时同步到inip和upsq的时候，源头都是从vs开始同步。

### （3）跨IDC变同IDC原则

当需要进行跨IDC同步的时候，比如高可用的场景，上海和武汉都有VS的服务，需要把上海的vs同步到武汉时，我们需要新增个vs-cpoy的服务，而不是直接同把上海的vs同步到武汉的vs里面，这样变相把跨idc的访问转换成本IDC的访问

## 6、配置流程

在天微平台控台登录，注册中心同步-服务同步中进行nacos同步任务的配置

支持同一个nacos集群内不同namespace的同步；支持不同nacos集群间的同步

可以根据实际情况进行配置，目前支持四种同步策略：全量同步、前缀同步、枚举同步、单个同步

![image-20231117150747981](组件测试-Nacos同步工具.assets/image-20231117150747981.png)

在组件管理-节点列表中选择同步中心，搜索同步中心节点

![image-20231117151139848](组件测试-Nacos同步工具.assets/image-20231117151139848.png)

在同步节点中，查看实时同步任务的详情数据

![image-20231117151321860](组件测试-Nacos同步工具.assets/image-20231117151321860.png)

![image-20231117151354165](组件测试-Nacos同步工具.assets/image-20231117151354165.png)

## 7、测试要点

通过天微控台配置的相关同步任务，验证同步工具同步的准确性

支持同一个集群内不通namesapce的数据同步，不同集群之间的数据同步

通过源集群和目标集群的nacos控台验证数据的准确性

（1）通过天微控台的比对功能验证数据的准确性，对同步结果和详情进行校对，并与nacos的实际provider数据进行对比

（2）在目标nacos的控台查看数据是否正常同步成功，

（3）通过consumer调用provider看请求是否可以正常打到同步过来的provider上面去

如vs的两个服务域，其中一个服务域不可用，转发到另外一个服务域上，但是这个服务域对应的nacos集群的ns中没有注册相关的服务，可以借助域nacos同步工具，将uat114服务域的服务同步到uat113服务域上面去，这样可以通过uat113的业务网关将请求转发到后端

### 8、典型问题记录

【偶现】同步实例数较多的情况下，暂停或删除同步任务后，存在少部分实例无法从目标集群剔除的情况（补充）

# 欢迎大家使用！！！