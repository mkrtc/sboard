# Тестовое задание для разработчика: Full-stack приложение с Event Sourcing и историей версий для [Sboard](https://sboard.online/)

**Демонстрацию работы можно посмотреть [здесь](https://sboard-ivory.vercel.app)**

## Быстрый старт

- Установить приложение
    ```bash
    git clone https://github.com/mkrtc/sboard.git
    ```
- Перейти в папку с приложением
    ```bash
    cd ./sboard
    ```
- Собрать docker compose и запустить
  ```bash
  # ~2-4 мин
  sudo docker compose up --build
  ```
- Открыть `localhost:3000`

## Оглавления
- [Краткое описание ТЗ](#краткое-описание-тз-подробнее-можете-посмотреть-здесь)
- [Frontend](#frontend)
- [Backend](#backend)
- [Дополнительные задачи](#дополнительные-требования)
  
## Краткое описание ТЗ. Подробнее можете посмотреть [здесь](https://github.com/mkrtc/sboard/blob/master/task.pdf)

- ***Задача:***
  >Напишите full-stack приложение на TypeScript, состоящее из frontend и backend-частей. 
  Приложение должно демонстрировать работу архитектурного подхода Event Sourcing и 
  предоставлять функциональность истории версий на его основе.

Этапы и реализация:
### Frontend
`path: /sboard/client`
#### Интерфейс
- [X] **- Используйте canvas для отрисовки графических объектов.**
  
    >*В разработке было принято решение использовать дефолтный Canvas API, поскольку библиотеки по типу **[KonovaJS](https://konvajs.org/)** не смотря на свое удобство значительно облегчают работу, а в данном случае я хотел показать свое умение работать именно с ванильным Canvas API*
- [X] **- Минимальная графика — квадраты, которые можно перетаскивать мышкой.**
  
  >*Все реализовано по ТЗ. Бонусом так же реализована возможность добавление квадратов и очистки холста*

- [X] **- Справа от canvas расположить панель с историей версий:** 
  - [X] Каждая версия содержит метку времени. 
  - [X] Версии отображаются в виде кликабельных элементов списка. 
  - [X] При выборе версии отображение на canvas должно соответствовать состоянию на тот момент.
  
  >*Все ревизовано по ТЗ. Бонусом так же ревизована возможность продолжения события при откате. Т.е. если вы откатились на 3 событий назад, то сможете продолжить именно с этого события. Новые события(после отката) так жк будут записаны*

#### Функциональность
- [X] **- При завершении действия пользователя (например, отпускании мышки после 
перемещения квадрата), отправляйте событие на сервер через WebSocket.**
- [X] **- После получения подтверждения от сервера обновляйте список версий**

#### Ограничения
- [X] **- Использование React — `необязательно`.**
  
  >В разработке был использован фреймворк **[nextjs](https://nextjs.org/)** 
- [X] **- Использование Canvas API (или обёрток) — `обязательно`.**
    >В разработке был использован дефолтный Canvas API. Подробнее объяснил [здесь](#frontend)

### Backend

`path /sboard/server`

#### Архитектура
- [X] **- Реализовать на NestJS.**
- [X] **- Обеспечить работу через WebSocket.**
  >Вебсокеты работают с помошю библиотек **@nestjs/websockets** и **@nestjs/platform-socket.io**. Подробнее [здесь](https://docs.nestjs.com/websockets/gateways).
- [X] **- Использовать PostgreSQL для хранения данных.**

#### Функциональность
- [X] **- Получение полного состояния (на основе всех ивентов).**
- [X] **- Получение состояния до определённого события (например, по ID или дате).**
  >Получение состояния работает по ID 
- [X] **- Получение списка всех версий (событий).**
  >Доступно по эндпоинту: `[GET] /canvas-events`
- [X] **- При получении события от фронта сохранять событие в базе данных**
  
#### Типы событий (примерные):
Поскольку тип являлись примерами, пришлось немного измени/добавить в угоду масштабируемости.

*Что изменилось/добавилось:*
- **SquareCreated - CreateFigure** 
  >Название **figure** подходит больше, поскольку если нужно будет в будущем добавлять новые фигуры, то не придется для этого создавать новые события по типу: **CircleCreated** или **TriangleCreated**.
- **SquareMoved - MoveFigure**
- **SquareDeleted - DeleteFigure**

Новые события:
- **GetEvent** - Получить определенное событие. Событие не возвращает событие а возвращает(точнее эмитит на `update_canvas`) состояния до/включительно этого события.
- **GetLastEvent** - Эмитит последнее актуальное состояние на `update_canvas`.
- **ClearCanvas** - Очищает канвас.
  >ВАЖНО!!! Событие не удаляет предыдущее события, а именно добавляет новое событие. Если при восстановлении метод `.replaySnapshot()` Доходит до ивента `clear_canvas` то просто очищает массив.
- **UpdateCanvas** - (Для клиента) Подписка на обновление канваса.

#### Требования к хранилищу
- [X] **- События должны храниться отдельно (event store).** 
  >Все события хранятся в базе данных в виде отдельных сущностей. Таблица: `events`
- [X] **- Состояние должно вычисляться on-the-fly, при запросе, а не кэшироваться в базе.** 
  >Состояние вычитывается на основе ивентов и ближайшего снапшота. Метод для восстановления события: `.replaySnapshot()`
- [X] **- Отдельно хранить снимки, например каждый 10-ый ивент. Использовать их, для более быстрого восстановления состояния (опционально)**
  >На каждый 10й ивент создается новый снапшот который с подошью метода `.replaySnapshot()` восстанавливает состояния до текущего ивента включительно и сохраняет в колонке `state`. так же новый снапшот создается если пользователь решил что хочет откатится на n событий назад и продолжить оттуда. Таблица: `canvas-snapshots`

### Дополнительные требования
- [X] **- Реализация кода на TypeScript на всех уровнях.** 
- [X] **- Хорошая архитектурная организация кода (модули, слои).**
  >Архитектура бэкенда основан на модульной архитектуру на котором построен **[nestjs](https://nestjs.com/)**. Она и так удобная, не вижу смысла его менять.
  >
  >Подробнее про архитектуру фронтэнда можете почитать [здесь](#архитектура-frontend)
- [X] **- Приветствуется покрытие основного бизнес-алгоритма (event reducer) тестами.**
  >Все бэекенд сущности покрыти юнит тестами. 
  >Запуск:
  ```bash
  cd server
  npm run test
  ``` 
- [X] Программа должна обрабатывать ошибки: например, невалидные события или попытка запросить несуществующую версию.
  >Все события и эндпоинты валидированы с помошью библиотек: [class-validator](https://www.npmjs.com/package/class-validator) и [class-transformer](https://www.npmjs.com/package/class-transformer)

## Архитектура Frontend
Архитектура фронтенда состоит из 5 уровней (0-4)

### 0 уровень - провайдеры (providers). 
Провайдеры - это классы без бизнес логики. Пример провайдеров: SocketProvider, HttpProvider. Эти провайдеры обеспечивают работу с внешними источниками, но сами по себе ничего не делают.

*Пример:*
```ts
class HttpProvider{
    public async get<T>(url: string){
        try{
            const response = await fetch(url);
            return await response.json() as T;
        }catch(exception){
            throw new CustomHttpProviderException(exception);
        }
    }
    // ... other methods
}
```

### 1 уровень - репозитории (repositories). 
Репозитории - это классы которые общаются с внешними источниками. В себя могут внедрять провайдеры для обеспечения работы сети. Репозитории всегда возвращают сущности.

*Пример:*
```ts
class UserRepository{
    private readonly url: string = "https://api.example.com/user";
    constructor(
        private readonly httpProvider: HttpProvider
    ){}

    public async getUserList(){
        const users = await httpProvider.get(this.url);

        // Вторым параметром передаем текущий инстанс репозитория, поскольку сущность так же может использовать методы репозитория.
        return users.map(user => new UserEntity(user, this));
    }

    public updateUser(id: number, data: Partial<Omit<"id", IUserEntity>>){
        const user = await this.httpProvider.patch(`${this.url}/${id}`, data):
        return new UserEntity(user, this);
    }
}
```

### 2 уровень - сущности (entities). 
Сущности - это модели которые имплементируют некие сущности, которые получают из вне. Например: EventEntity, UserEntity и тд. Сущности могут через конструктор внедрять в себя репозитории, а так могут реализовать методы для работы с конкретной сущностью.

*Пример:*
```ts
interface IUserEntity{
    id: number;
    name: string;
    phone: string;
    createdAt: string;
}

class UserEntity{
    public readonly id: number;
    public name: string;
    public phone: string;
    public createdAt: Date;

    private readonly userRepository: UserRepository;

    constructor(user: IUser, userRepository: UserRepository){
        this.userRepository = userRepository;
        Object.assign(this, {...user, createdAt: new Date(user.createdAt)});
    }

    public async save(){
        return await this.httpProvider.updateUser(this.id, this);
    }
}
```

### 3 уровень - сервисы (services).
Сервисы являются бизнес-логикой для компонента, обеспечивая отделяемость бизнес-логики от компонента и делая последнего максимально тупым в хорошем смысле этого слова. Сервисы могут внутри себя использовать репозитории и сущности. Сервисы напрямую связаны с компонентом, по этому хорошей считается создание сервиса(ов) рядом с компонентом.

*Пример:*
```ts
class UserService{
    private readonly userRepository: UserRepository;
    private readonly users: UserEntity[];
    private readonly initialized: boolean = false;

    constructor(){
        this.userRepository = new UserRepository(new HttpProvider);
    }

    public init(){
      this.initialized = true;
    }

    public async getUserList(){
        this.users = await this.userRepository.getUserList();
        return this.users;
    }
}
```
### 4 уровень - компоненты (components).
Компоненты используют или правильнее назвать - внедряют в себя сервис и пользуются его методами для обеспечения бизнес логики. Хорошей практикой считается отказ от создания функций внутри компонента(**кроме хуков**) и использование только методов сервиса. Исключением являются функции, которые должны положить/обновить состояние после отработки метода сервиса. Например если в вашем компоненте, необходимо отобразить список пользователей и в вашем сервисе есть метод `.getUsers()` который возвращает список пользователей из api, то вы можете создать функцию внутри компонента, который первым делом вызовет метод сервиса, а потом положит возвращаемое значение из метода в состояние.

*пример:*
```tsx
const UsersListComponent = () => {
    const userService = useMemo(() => new UserService, []);
    const [users, setUsers] = useState<UserEntity[]>([]);
    
    // Используем хук useEffect поскольку необходимо выполнить некую инициализацию после отрисовки компонента на клиенте.
    useEffect(() => {
        userService.init();
    }, [])

    // создаем функцию, потому что результат выполнении метода сервиса необходимо положить в userState
    const getUserList = async () => {
        const users = await userService.getUsers();
        setUsers(() => users);
    }

    return (
        <button onClick={getUserList}>Get user list</button>
        {users.map(user => (
            {/* Напрямую обращаемся к методу сервиса, поскольку вызов метода не будет вызвать ререндер компонента */}
            <span onClick={event => userService.onClickToUser(event, user)}>{user.name}</span>
        ))}
    )
}
```

### Структура проекта

```bash
client
└── src
    ├── 📁 app                        # 🧭 Страницы приложения (Next.js App Router)
    │   ├── 📁 page
    │   │   └── 📄 page.tsx          # 🧭 страница
    │   ├── 📄 layout.tsx            # 🧱 Общий layout
    │   └── 📄 page.tsx              # 🏠 Главная страница
    │
    ├── 📁 components                # 🧩 Компоненты и их окружение
    │   └── 📁 ExampleComponent/     # 🔸 Название компонента в PascalCase
    │       ├── 📁 views/            # 👁 Внутренние мини-компоненты (только внутри)
    │       │   └── 📄 ExampleView.tsx
    │       ├── 📁 styles/
    │       │   └── 📄 example.module.css
    │       ├── 📁 services/         # ⚙️ Локальные сервисы компонента
    │       │   └── 📄 example.service.ts
    │       └── 📄 ExampleComponent.tsx
    │
    ├── 📁 providers                 # 🌐 Провайдеры контекста/состояния
    │   ├── 📁 ExampleProvider/
    │   │   ├── 📄 example.provider.ts
    │   │   ├── 📄 example.context.ts  # (опц.) React Context API
    │   │   └── 📄 index.ts
    │   └── 📄 index.ts              # 📦 Реэкспорт всех провайдеров
    │
    ├── 📁 entities                  # 🧠 Бизнес-сущности и типы
    │   ├── 📁 example/
    │   │   ├── 📄 example.entity.ts  # 💡 Логика сущности (например, класс)
    │   │   ├── 📄 example.types.ts   # 📐 Типы, интерфейсы
    │   │   └── 📄 index.ts
    │   └── 📄 index.ts
    │
    ├── 📁 repositories              # 🗃 Работа с данными (API, LocalStorage, и т.п.)
    │   ├── 📁 example/
    │   │   ├── 📄 example.repository.ts
    │   │   ├── 📄 example.types.ts
    │   │   └── 📄 index.ts
    │   └── 📄 index.ts
    │
    ├── 📁 shared                    # 🔁 Переиспользуемые утилиты, конфиги, компоненты
    │   ├── 📁 components/           # 🧩 UI-компоненты общего назначения
    │   │   └── 📁 Button/
    │   │       ├── 📄 Button.tsx
    │   │       └── 📄 button.module.css
    │   ├── 📁 utils/                # 🛠 Утилиты (formatDate, groupBy, ...)
    │   │   └── 📄 formatDate.ts
    │   ├── 📁 config/               # ⚙️ Конфиги, env-обёртки, роуты
    │   │   └── 📄 api.config.ts
    │   └── 📄 index.ts              # 📦 Общий экспорт shared
    │
    └── 📁 styles                    # 🎨 Глобальные стили и темы
        ├── 📄 globals.css
        ├── 📄 reset.css
        └── 📁 themes/
            └── 📄 dark.theme.css
```