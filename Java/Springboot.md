# 1、 Spring 框架的两个核心概念

**IoC（控制反转）** 和 **AOP（面向切面编程）**。它们是 Spring 的基石，理解了它们就理解了 Spring 的精髓。

---

### 1. IoC (Inversion of Control) - 控制反转

#### 核心思想：**“不用找我，我来找你”**

在传统程序中，当某个对象需要依赖另一个对象时，通常由它自己来主动创建和管理这个依赖对象（`new` 关键字）。**控制权在程序本身**。

而 IoC 的理念是：**将对象的创建、组装、管理权交给一个外部的容器（即 Spring IoC 容器）**。程序不再主动创建依赖，而是被动地等待容器将它所需要的依赖**注入**给它。**控制权发生了反转，从程序转移到了容器**。

**举个例子：**
*   **没有 IoC**：就像你自己去菜市场买菜、切菜、炒菜。你很忙，控制权在你。
*   **有 IoC**：就像去餐厅吃饭。你只需要点菜（**定义需求**），餐厅厨房（**IoC 容器**）会做好菜并端给你（**注入依赖**）。你很轻松，控制权在厨房。

#### 关键实现：**DI (Dependency Injection) - 依赖注入**

DI 是 IoC 的一种具体实现方式。**IoC 是思想，DI 是手段**。Spring 通过 DI 机制来实现控制反转。

**依赖注入的三种方式：**

1.  **构造器注入**（推荐）：通过构造函数传入依赖。
    
    ```java
    public class UserService {
        private final UserRepository userRepo;
        // 容器通过调用这个构造器，将UserRepository注入进来
        public UserService(UserRepository userRepo) {
            this.userRepo = userRepo;
        }
    }
    ```
2.  **Setter 方法注入**：通过 setter 方法传入依赖。
    ```java
    public class UserService {
        private UserRepository userRepo;
        // 容器通过调用这个setter方法，将UserRepository注入进来
        public void setUserRepo(UserRepository userRepo) {
            this.userRepo = userRepo;
        }
    }
    ```
3.  **字段注入**：通过 `@Autowired` 注解直接标注在字段上。
    
    ```java
    public class UserService {
        @Autowired // 容器通过反射机制，直接将UserRepository注入到这个字段
        private UserRepository userRepo;
    }
    ```

#### IoC 容器的核心工作流程：
1.  **配置元数据**：你通过 XML、Java 注解（如 `@Component`, `@Service`) 或 Java 配置（`@Configuration`, `@Bean`）告诉容器要管理哪些对象（Bean）以及它们之间的依赖关系。
2.  **初始化容器**：Spring 读取配置元数据。
3.  **创建和管理 Bean**：容器根据配置**创建 Bean 实例**，并解决它们之间的依赖关系（注入）。
4.  **提供 Bean**：当应用程序需要时，容器将准备好的 Bean 提供给它。

**总结 IoC 的好处：**
*   **解耦**：对象之间的依赖关系由容器维护，大大降低了代码的耦合度。
*   **易于测试**：可以轻松地注入模拟对象（Mock）进行单元测试。
*   **可维护性高**：配置集中管理，想要替换一个实现（如将 MySQL 数据源换成 Oracle）非常方便，只需修改配置即可，无需修改代码。
*   **资源统一管理**：例如数据库连接池、事务管理等这些“重量级”对象可以由容器统一创建和管理，保证高效使用。

---

### 2. AOP (Aspect-Oriented Programming) - 面向切面编程

#### 核心思想：**“横向抽离，统一处理”**

在传统 OOP（面向对象编程）中，我们通过类和方法来组织代码。但像**日志记录、事务管理、安全校验**这样的功能，它们会“横切”到很多不同的业务方法中（例如所有业务方法都需要记录日志）。

如果每个方法里都写一遍日志代码，会导致：
*   **代码冗余**：相同的代码散落在各处。
*   **核心业务逻辑不清晰**：业务代码被非核心功能（“切面”代码）淹没。
*   **难以维护**：如果要修改日志格式，需要改动所有地方。

AOP 就是为了解决这个问题。它允许我们将这些**散布在各处的横切关注点（Cross-cutting Concerns）代码从业务逻辑中分离出来**，形成一个独立的模块，称为**切面（Aspect）**。然后，在运行时，动态地将这些切面代码**织入（Weaving）** 到指定的业务方法中。

#### AOP 核心概念：

| 术语                    | 解释                                                         | 生活比喻                                                     |
| :---------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **Aspect (切面)**       | 横切关注点的模块化。一个切面是**通知**和**切点**的结合。     | **“律师”**，他专门处理“打官司”这个横切关注点。               |
| **Join Point (连接点)** | 程序执行过程中的一个点，如方法调用、异常抛出等。**Spring AOP 中特指方法的执行**。 | **“所有可能需要打官司的场合”**（如签合同、发生纠纷）。       |
| **Advice (通知)**       | 切面在特定连接点上执行的动作。如 `@Before`, `@After`等。     | **律师的具体服务**，比如“在签合同**之前**（时机）审核条款（动作）”。 |
| **Pointcut (切点)**     | 一个表达式，用来**匹配**哪些**连接点**需要被切入。**定义了通知被应用的位置**。 | **律师的服务范围**，比如“只为金额超过100万的合同提供服务”（匹配规则）。 |
| **Weaving (织入)**      | 将切面应用到目标对象并创建代理对象的过程。                   | **聘请律师的过程**。一旦聘请成功（织入），你每次签合同（连接点）时，律师（切面）都会自动介入。 |

#### Spring AOP 示例：记录方法执行时间

1.  **定义切面 (Aspect)**：
    ```java
    @Aspect // 声明这是一个切面
    @Component
    public class LoggingAspect {
    
        // 定义切点 (Pointcut): 匹配com.example.service包下所有类的所有方法
        @Pointcut("execution(* com.example.service.*.*(..))")
        public void serviceMethods() {}
    
        // 定义通知 (Advice): 在方法执行前和执行后做什么
        @Around("serviceMethods()") // 环绕通知，最强大的一种通知
        public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
            long start = System.currentTimeMillis();
            
            Object proceed = joinPoint.proceed(); // 继续执行原方法
            
            long executionTime = System.currentTimeMillis() - start;
            System.out.println(joinPoint.getSignature() + " executed in " + executionTime + "ms");
            
            return proceed;
        }
    }
    ```
2.  **效果**：你不需要在任何 `com.example.service.*` 下的类和方法中编写任何记录时间的代码。Spring AOP 会自动为这些方法**生成代理**，并在它们执行时**织入**这段日志逻辑。

**总结 AOP 的好处：**
*   **代码复用**：将通用功能集中在一个地方。
*   **业务纯净**：业务模块只关注核心逻辑，更加清晰易读。
*   **灵活可插拔**：通过配置即可添加或移除切面功能，无需修改业务代码。

---

### IoC 与 AOP 的关系

它们是 Spring 的两个不同维度的核心功能，相辅相成，共同实现了 Spring 的“解耦”哲学。

*   **IoC 是基石**：它管理了所有的对象（Bean），建立了对象之间纵向的、明面的依赖关系（如 `UserService` 依赖 `UserRepository`）。
*   **AOP 是增强**：它解决了横跨多个对象的横向关注点问题（如为所有 `Service` 的方法添加日志）。**AOP 的实现依赖于 IoC 容器管理的 Bean**，因为它需要为这些 Bean 创建代理对象。

简单来说：**IoC 让对象之间的依赖关系反向，而 AOP 让那些遍布应用的横切代码从业务逻辑中分离出来**。两者结合，使得应用程序更加模块化、灵活和易于维护。

# 2、Springboot常用注解

好的，Spring Boot 的常用注解非常多，但它们可以很有条理地进行分类。掌握这些注解是高效开发的关键。

### 1. 启动与核心配置注解

| 注解                         | 说明                                                         |
| :--------------------------- | :----------------------------------------------------------- |
| **`@SpringBootApplication`** | **核心注解**，标注主启动类。是 `@SpringBootConfiguration`, `@EnableAutoConfiguration`, `@ComponentScan` 三个注解的组合。 |
| `@SpringBootConfiguration`   | 表明这是一个 Spring Boot 的配置类。                          |
| `@EnableAutoConfiguration`   | **开启自动配置**，Spring Boot 的魔法所在，根据依赖自动配置应用。 |
| `@ComponentScan`             | 自动扫描并注册当前包及其子包下的组件（`@Component`, `@Service`, `@Controller` 等）为 Bean。 |
| `@Configuration`             | 标记一个类为**配置类**，相当于一个 XML 配置文件。            |
| `@Bean`                      | 在配置类的方法上使用，将方法的返回值定义为一个 **Spring Bean**，交由 IoC 容器管理。 |
| `@Value`                     | **属性注入**，将配置文件中的值注入到类的字段或方法参数中。支持 SpEL 表达式。 |
| `@ConfigurationProperties`   | **批量属性绑定**，将配置文件（如 `application.yml`）中的一组属性批量注入到一个 Bean 的对应字段中。 |
| `@PropertySource`            | 指定自定义的配置文件位置，加载额外的属性文件。               |

**示例：**
```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}

@Configuration
public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}

@Component
public class MyComponent {
    @Value("${app.name}") // 注入application.properties中的app.name
    private String appName;
    
    @Value("${server.port:8080}") // 带默认值
    private int port;
}

@ConfigurationProperties(prefix = "myapp")
public class MyAppProperties {
    private String name;
    private String version;
    // getters and setters
}
```

---

### 2. Web 相关注解 (Spring MVC)

| 注解                                                         | 说明                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| **`@RestController`**                                        | **组合注解**，等于 `@Controller` + `@ResponseBody`。表示这个 Controller 的所有方法返回的数据都直接写入 HTTP 响应体，通常用于编写 **RESTful API**。 |
| `@Controller`                                                | 标记一个类为 Web 控制器，处理 HTTP 请求。                    |
| `@RequestMapping`                                            | **路由映射**，将 HTTP 请求映射到 MVC 控制器的方法上。可指定路径、方法（GET/POST等）。 |
| `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping` | **`@RequestMapping` 的快捷方式**，分别用于简化不同 HTTP 方法的映射。 |
| `@RequestParam`                                              | 获取 **URL 查询参数** 或 **表单数据**。                      |
| `@PathVariable`                                              | 获取 **URL 路径模板** 中的变量。                             |
| `@RequestBody`                                               | 将 **HTTP 请求体**（通常是 JSON）解析并绑定到方法参数上。    |
| `@ResponseBody`                                              | 将方法返回的对象直接写入 HTTP 响应体（如返回 JSON/XML）。    |
| `@RestControllerAdvice`                                      | **全局异常处理**，结合 `@ExceptionHandler` 用于处理整个应用的异常。 |

**示例：**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id, @RequestParam(required = false) String detail) {
        // 获取路径变量id和查询参数detail
        return userService.findById(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) { // 解析JSON请求体
        return userService.save(user);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleException(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
```

---

### 3. 数据访问相关注解 (Spring Data JPA)

| 注解              | 说明                                        |
| :---------------- | :------------------------------------------ |
| **`@Entity`**     | 标记一个类为 **JPA 实体**，与数据库表映射。 |
| `@Table`          | 指定实体类映射的数据库表名。                |
| `@Id`             | 声明实体类的**主键**字段。                  |
| `@GeneratedValue` | 指定主键的**生成策略**（如自增、UUID等）。  |
| `@Column`         | 指定字段映射的数据库列名及其属性。          |
| `@Repository`     | 标记一个类为**数据访问层（DAO）组件**。     |
| `@Transactional`  | **声明事务**，可以标注在类或方法上。        |

**示例：**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_name", nullable = false)
    private String username;
    // ... other fields, getters, setters
}

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA 会自动实现该方法
    User findByUsername(String username);
}

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Transactional // 此方法受事务管理
    public User createUser(User user) {
        return userRepository.save(user);
    }
}
```

---

### 4. 功能与增强注解

| 注解             | 说明                                                         |
| :--------------- | :----------------------------------------------------------- |
| **`@Autowired`** | **自动依赖注入**。Spring 会自动寻找合适的 Bean 并注入到字段、构造器或 setter 方法中。 |
| `@Component`     | **通用组件注解**，标记一个类为 Spring 组件，会被组件扫描自动检测并注册为 Bean。 |
| `@Service`       | 标记一个类为**业务服务层组件**，是 `@Component` 的特化。     |
| `@Repository`    | 标记一个类为**数据仓库组件**，是 `@Component` 的特化，同时会将平台特定的持久化异常转换为 Spring 的统一异常。 |
| `@Qualifier`     | 当有多个相同类型的 Bean 时，用此注解指定要注入的具体 Bean 的名称。 |
| `@Profile`       | 指定某个 Bean 或配置只在特定的**环境 Profile**（如 `dev`, `test`, `prod`）下才被激活和注册。 |
| `@Scheduled`     | **定时任务**，标注方法后，方法会按指定的 cron 表达式或固定延迟时间执行。 |
| `@Async`         | **异步方法**，标注后该方法会在独立的线程中执行。             |

**示例：**
```java
@Service
public class MyService {

    private final OtherService otherService;
    
    // 构造器注入（推荐）
    @Autowired
    public MyService(OtherService otherService) {
        this.otherService = otherService;
    }

    @Scheduled(cron = "0 0/5 * * * ?") // 每5分钟执行一次
    public void doScheduledTask() {
        // ...
    }
    
    @Async
    public void doAsyncTask() {
        // 这个方法会异步执行
    }
}
```

掌握这些注解，你就已经能够应对绝大多数 Spring Boot 应用的开发场景了。