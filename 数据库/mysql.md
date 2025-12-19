MySQL 中最基础、最核心的操作：**CRUD**。

CRUD 代表四个基本操作：
*   **C**reate (创建) - `INSERT`
*   **R**ead (读取) - `SELECT`
*   **U**pdate (更新) - `UPDATE`
*   **D**elete (删除) - `DELETE`

为了让讲解更直观，我们假设有一个名为 `users` 的表，结构如下：

| 字段名  | 类型           | 说明         |
| :------ | :------------- | :----------- |
| `id`    | `INT`          | 主键，自增长 |
| `name`  | `VARCHAR(50)`  | 用户名       |
| `email` | `VARCHAR(100)` | 邮箱         |
| `age`   | `INT`          | 年龄         |

---

### 1. Create (创建) - `INSERT` 语句

`INSERT` 语句用于向表中**添加新的记录（行）**。

**基本语法：**
```sql
INSERT INTO table_name (column1, column2, column3, ...)
VALUES (value1, value2, value3, ...);
```

**示例：**
1.  **指定列插入**（推荐）
    ```sql
    -- 向 users 表中插入一条新记录
    INSERT INTO users (name, email, age)
    VALUES ('张三', 'zhangsan@example.com', 25);
    ```
    *   注意：`id` 字段是自增的，不需要我们手动插入值，数据库会自动生成。

2.  **省略列名插入**（需提供所有列的值，且顺序一致）
    ```sql
    INSERT INTO users
    VALUES (NULL, '李四', 'lisi@example.com', 30); -- id 设为 NULL 或 0 以触发自增
    ```

3.  **一次性插入多条数据**
    ```sql
    INSERT INTO users (name, email, age)
    VALUES 
      ('王五', 'wangwu@example.com', 28),
      ('赵六', 'zhaoliu@example.com', 35);
    ```

---

### 2. Read (读取) - `SELECT` 语句

`SELECT` 语句用于从表中**查询数据**。这是最常用也是最复杂的语句。

**基本语法：**
```sql
SELECT column1, column2, ... -- 指定要查询的列，用 * 代表所有列
FROM table_name
[WHERE condition] -- 筛选条件
[ORDER BY column_name [ASC|DESC]] -- 排序
[LIMIT number]; -- 限制返回条数
```

**示例：**
1.  **查询所有数据的所有列**
    ```sql
    SELECT * FROM users;
    ```

2.  **查询特定列**
    ```sql
    SELECT name, email FROM users;
    ```

3.  **带条件的查询 (`WHERE` 子句)**
    ```sql
    -- 查询年龄大于 25 的用户
    SELECT * FROM users WHERE age > 25;

    -- 查询姓名为 '张三' 的用户
    SELECT * FROM users WHERE name = '张三';

    -- 查询年龄在 25 到 35 之间的用户 (BETWEEN...AND...)
    SELECT * FROM users WHERE age BETWEEN 25 AND 35;

    -- 查询邮箱包含 'example' 的用户 (LIKE 模糊查询)
    SELECT * FROM users WHERE email LIKE '%example%'; -- % 代表任意字符

    -- 查询多个条件：年龄大于25 并且 邮箱包含 'example' (AND)
    SELECT * FROM users WHERE age > 25 AND email LIKE '%example%';
    ```

4.  **对结果排序 (`ORDER BY` 子句)**
    ```sql
    -- 按年龄从小到大排序 (默认 ASC 升序)
    SELECT * FROM users ORDER BY age;

    -- 按年龄从大到小排序 (DESC 降序)
    SELECT * FROM users ORDER BY age DESC;

    -- 先按年龄降序排，年龄相同的再按姓名升序排
    SELECT * FROM users ORDER BY age DESC, name ASC;
    ```

5.  **限制返回条数 (`LIMIT` 子句)**
    ```sql
    -- 只返回前 2 条记录
    SELECT * FROM users LIMIT 2;

    -- 分页查询：从第0条开始（跳过0条），返回5条记录
    -- LIMIT offset, row_count
    SELECT * FROM users LIMIT 0, 5; -- 第1页
    SELECT * FROM users LIMIT 5, 5; -- 第2页
    ```

---

### 3. Update (更新) - `UPDATE` 语句

`UPDATE` 语句用于**修改表中已有的记录**。

**基本语法：**
```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition; -- !!! 警告：千万不要忘记 WHERE 子句 !!!
```

**示例：**
1.  **更新特定记录**（**必须用 `WHERE`**）
    ```sql
    -- 将张三的年龄更新为 26
    UPDATE users SET age = 26 WHERE name = '张三';

    -- 将邮箱为 'lisi@example.com' 的用户姓名改为 '李四哥'
    UPDATE users SET name = '李四哥' WHERE email = 'lisi@example.com';
    ```

2.  **更新多个字段**
    ```sql
    UPDATE users SET name = '王五爷', age = 40 WHERE id = 3;
    ```

**⚠️ 极度重要警告：** 如果没有 `WHERE` 子句，**将会更新表中的所有记录**！这通常是灾难性的。
```sql
-- 灾难语句：会把所有用户的年龄都改成 50！
UPDATE users SET age = 50;
```

---

### 4. Delete (删除) - `DELETE` 语句

`DELETE` 语句用于从表中**删除记录**。

**基本语法：**
```sql
DELETE FROM table_name
WHERE condition; -- !!! 警告：千万不要忘记 WHERE 子句 !!!
```

**示例：**
1.  **删除特定记录**（**必须用 `WHERE`**）
    ```sql
    -- 删除姓名为 '赵六' 的用户
    DELETE FROM users WHERE name = '赵六';

    -- 删除所有年龄小于 20 的用户
    DELETE FROM users WHERE age < 20;
    ```

**⚠️ 极度重要警告：** 如果没有 `WHERE` 子句，**将会删除表中的所有记录**！这比更新更可怕。
```sql
-- 灾难语句：会清空整个 users 表！
DELETE FROM users;
```
**更安全的清空表操作**：如果要清空整个表，使用 `TRUNCATE TABLE` 语句通常性能更好，而且它会重置自增计数器。
```sql
TRUNCATE TABLE users;
```

---

### 总结与记忆要点

| 操作   | 关键字                       | 重要语法                     | 危险操作              |
| :----- | :--------------------------- | :--------------------------- | :-------------------- |
| **增** | `INSERT INTO ... VALUES ...` | 指定列名更安全               | -                     |
| **查** | `SELECT ... FROM ...`        | `WHERE`, `ORDER BY`, `LIMIT` | -                     |
| **改** | `UPDATE ... SET ...`         | **必须要有 `WHERE`**         | `UPDATE` 不带 `WHERE` |
| **删** | `DELETE FROM ...`            | **必须要有 `WHERE`**         | `DELETE` 不带 `WHERE` |

**最佳实践：**
1.  **先写 `WHERE`**：在执行 `UPDATE` 和 `DELETE` 前，最好先写一个 `SELECT` 语句用同样的 `WHERE` 条件确认要操作的数据是否正确。
2.  **使用事务**：在生产环境中，重要的修改和删除操作最好在事务中进行，以便出错时可以回滚。
3.  **备份**：操作前备份数据总是个好习惯。