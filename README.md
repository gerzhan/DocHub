# DocHub

![Инкрементальное развитие архитектуры](pics/interface.png)

DocHub - инструмент описания архитектуры через код (Architecture as a code). Код архитектуры - ансамбль файлов на языках,
решающих задачу описания. Поддерживаются:

* [PlantUML](https://plantuml.com/) - позволяет создавать диаграммы, используя простой и интуитивно понятный язык;
* [Mermaid](https://mermaid-js.github.io/mermaid/#/) - позволяет создавать диаграммы с использованием кода;
* [Markdown](https://ru.wikipedia.org/wiki/Markdown) - язык разметки, созданный с целью обозначения форматирования в тексте;
* [Swagger](https://swagger.io/) - язык описания HTTP API контрактов;
* [AsyncAPI](https://www.asyncapi.com/) - язык описания событийных контрактов;
* [SmartAnts](https://dochub.info/docs/dochub.smartants) - продвинутый инструмент презентации архитектуры.
* [Манифесты](https://dochub.info/docs/dochub_contexts) - структурированные файлы в формате YAML/JSON для описания архитектурных объектов;

Решаемые проблемы:

* [Управление версиями](#versions);
* [Децентрализованное управление архитектурой в Agile-ориентированных компаниях](#decentralized);
* [Управление архитектурой экосистемы](#ecosystem);
* [Создание архитектурных фасадов (портал документации)](#facade);
* [Анализ архитектуры](#analysis);
* [Контроль консистентности](#problems);
* [Расширяемая матамодель](#extmetamodel).

## Быстрый старт

Рекомендую начать с прочтения статьи [Архитектра рядом с кодом](https://habr.com/ru/post/659595/).
Познакомиться с работой инструмента и его подробной документацией можно на сайте 
[https://dochub.info](https://dochub.info/). 
Примеры использования можно найти в специальном репозитории, который развивает 
сообщество - [Примеры DocHub](https://github.com/rpiontik/DocHubExamples)

Вступайте в сообщество [DocHubTeam](https://t.me/archascode). Здесь мы
обсуждаем подход "Архитектура как код" и опыт применения DocHub.

## План развития

```mermaid
gantt
    title Новые фичи продукта
    dateFormat  YYYY-MM
    section Q1
        Plugins                 :done, plugins, 2023-01-01, 40d
        SmartAnts               :done, smartants, 2023-02-01, 30d
        Export to Excalidraw    :done, exportexc, 2023-02-20, 11d
        Backend                 :active, 2023-02-27, 30d
    section Q2
        Event Storming tool         :2023-04-01, 90d
        Mutators                    :2023-04-01, 90d
        Revers architecture tool    :2023-04-01, 90d
    section Q3
        Process Disigner tool       :2023-07-01, 90d
        Public metamodel repository :2023-07-01, 90d
        Time Machine                :2023-07-01, 90d
    section Q4
        Architectire Commutiny tool :2023-10-01, 90d

click plugins href "https://dochub.info/docs/dochub.plugins.intro"
click smartants href "https://dochub.info/docs/dochub.smartants"
click exportexc href "https://dochub.info/docs/dochub.smartants#%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%B5%D0%B9%D1%88%D0%B5%D0%B5-%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5"
```

## <a name="versions"></a> Управление версиями архитектуры

DocHub позволяет развивать кодовую базу архитектуры аналогично кодовой базе приложений. В качестве системы управления
версиями используется GitLab.

![Инкрементальное развитие архитектуры](pics/inc_arch.png)

## <a name="decentralized"></a> Децентрализованное управление архитектурой в Agile-ориентированных компаниях

DocHub умеет консолидировать описание архитектуры из различных источников. Например, из разных репозиториев. Это
позволяет командам действовать независимо в сотрудничестве друг с другом.

![Децентрадлизованное управление архитектурой](pics/decentralized.png)

## <a name="ecosystem"></a> Управление архитектурой экосистем

DocHub создан с учетом современных проблем в управлении архитектурой экосистемы. В ней продукты взаимосвязаны,
но развиваются автономно. DocHub позволяет создать единое информационное пространство для экосистемы. Стимулирует
положительную синергию продуктов.

![Управление эксоситемой](pics/ecosystem.png)

## <a name="facade"></a> Архитектурные фасады

DocHub хорошо решает задачу публичного портала документации.

![Архитектурные фасады](pics/facade.png)

[Пример портала](https://dochub.info/).


## <a name="analysis"></a> Анализ архитектуры

Один из ключевых принципов инструмента - Архитектура как данные. Это означает, что вы можете
получать ценные для себя сведения из архитектуры, используя язык запросов [JSONata](https://jsonata.org/).

Протейшим примером этого подхода являются [табличные документы](https://dochub.info/docs/dochub.tables).


## <a name="problems"></a> Контроль консистентности архитектуры

DocHub умеет находить проблемы в описании архитектуры и контролировать определенные вами правила.

![Валидатор](pics/validators.png)

## <a name="extmetamodel"></a> Расширяемая матамодель

Матемодель DocHub может быть расширена по вашему желанию. Есть возможность как модифицировать
уже существующие сущности, так и создавать собственные.

Познакомиться с идеей ближе можно в статье [Код архитектуры — это жидкость](https://habr.com/ru/post/701050/).

Пример можно посмотреть [здесь](https://github.com/rpiontik/DocHubExamples/tree/main/src/C4Model)


## Развертывание

### Конфигурирование

Определите необходимые переменные окружения. Используйте файл примера [example.env](example.env) для этого. Переименуйте его для
продакшен окружения в ".env" для локального развертывания в ".env".

Если вы ничего не будете трогать, развертывание произойдет с дефолтными настройками. В этом случае DocHub будет
содержать собственную документацию.

### Локальное развертывание

Выполните команды:
```
docker-compose up --build
```
DocHub станет доступен по адресу [http://localhost:8080/main](http://localhost:8080/main)

### Сборка из исходников для продакшен

Проект является VueJS SPA приложением. В качестве backend пользуется GitLab.

Для развёртывания потребуется стандартная сборка VueJS приложения средствами npm, версией не ниже 8.1.х (версия node 16.х.х).
```
npm сi
npm run build
```

В результате будут сгенерированы статические файлы в папке /dist. Их необходимо
опубликовать используя web-сервер. Например, nginx.

Подробнее о вариантах развертывания можно узнать [тут](https://cli.vuejs.org/ru/guide/deployment.html).

## Интеграция с GitLab
### Для локального развертывания
В файле "example" укажите адрес GitLab в соответствующей переменной:
```
VUE_APP_DOCHUB_GITLAB_URL=https://foo.space
```

В GitLab **под своей учетной записью** выпустите персональный токен Profile->Preferences->Access Tokens

![Пример настройки GitLab](pics/personal_token.png)

Полученный токен укажите в файле ".env" в переменной:
```
# Персональный токен gitlab. Используется для локальной разработки
VUE_APP_DOCHUB_PERSONAL_TOKEN=9H...FR
```

Перезапустите контейнеры:
```
docker-compose down
docker-compose up --build
```

### Локальное развитие архитектуры

Создайте папку "/public/workspace". Папка входит в .gitignore. Это нормально. Папка предназначена для
локального развертывания архитектурных репозиториев. Клонируйте необходимый архитектурный репозиторий.

```
cd /public/workspace
git clone git@git.foo.space:repo.git
```

Определите в ".env" переменную корневого манифеста:

```
VUE_APP_DOCHUB_ROOT_MANIFEST=workspace/repo/root.yaml
``` 

Перезапустите контейнеры:

```
docker-compose down
docker-compose up --build
```

Теперь вы можете вносить изменения в репозиторий локально и видеть результат изменений в режиме реального времени.

### Для продакшена
В файле ".env" укажите адрес GitLab в соответствующей переменной:
```
VUE_APP_DOCHUB_GITLAB_URL=https://foo.space
```

Настройте OAuth2 service provider в GitLab. Документацию по настройке можно найти на
[официальном сайте](https://docs.gitlab.com/ee/integration/oauth_provider.html).

![Пример настройки GitLab](pics/gitoauth.png)

Полученные токены укажите в файле .env в переменных:
```
# Идентификатор приложения зарегистрированного в GitLab
VUE_APP_DOCHUB_APP_ID=5f3...f0

# Секрет приложения
VUE_APP_DOCHUB_CLIENT_SECRET=1e4...384
```

Соберите приложение:
```
npm run build
```

# Статьи
* [Архитектура как кот VS Архитектура как кол](https://habr.com/ru/company/rabota/blog/578340/);
* [Архитектура как данные](https://habr.com/ru/post/593009/);
* [Архитектура рядом с кодом](https://habr.com/ru/post/659595/);
* [Код архитектуры — это жидкость](https://habr.com/ru/post/701050/);

# Сообщество

* [DocHubTeam](https://t.me/archascode)

# Лицензия
DocHub распространяется под лицензией Apache License 2.0 Open source license.
