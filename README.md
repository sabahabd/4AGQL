# PGE GraphQL School App

Application full-stack TypeScript avec:
- API GraphQL (Express + graphql-http)
- Base SQLite via Prisma
- Frontend statique multipage (HTML/CSS/JS)

## Fonctionnalites

### Backend
- Authentification JWT (login)
- Gestion des utilisateurs (create, read, update, delete)
- Gestion des notes:
  - mes notes groupees par cours
  - filtre par un ou plusieurs cours
  - create/update/delete reserve au role `Professor`
- Gestion des classes:
  - liste avec tri par nom (ASC/DESC)
  - affichage d'une classe
  - create/update/delete reserve au role `Professor`
  - suppression interdite si des etudiants sont affectes
  - ajout d'etudiant a une classe reserve au role `Professor`
- Analytics des notes (professeur):
  - filtres `studentId`, `course`, `classId`
  - statistiques calculees: moyenne, mediane, min, max, count

### Frontend (multipage)
- Page auth: `/index.html`
- Page users: `/users.html`
- Page grades: `/grades.html`
- Page classes: `/classes.html`
- Page analytics: `/analytics.html`
- Bouton deconnexion sur les pages protegees

## Stack
- Node.js + TypeScript
- Express
- GraphQL (`graphql`, `graphql-http`)
- Prisma + SQLite
- JS vanilla pour le frontend

## Prerequis
- Node.js 18+
- npm

## Installation

```bash
npm install
```

## Configuration

Creer un fichier `.env` a la racine:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="dev-secret"
JWT_EXPIRES_IN="7d"
```

## Initialiser Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Lancer le projet

### Mode developpement

```bash
npm run dev
```

### Mode production local (build + start)

```bash
npm run build
npm start
```

Serveur: `http://localhost:3000`

- Frontend: `http://localhost:3000/index.html`
- GraphQL endpoint: `http://localhost:3000/graphql`

## Structure du projet

```text
src/
  app.ts
  auth/
  db/
  graphql/
    resovler/
    schema/
  models/
  repositories/
  services/
  validator/
  public/
    css/
    js/
      api/
      pages/
      state/
      ui/
      utils/
      views/
```

## Exemples GraphQL

### Login

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      email
      pseudo
      role
    }
  }
}
```

Variables:

```json
{
  "input": {
    "email": "prof@example.com",
    "password": "secret123"
  }
}
```

### Mes notes (avec filtre cours)

```graphql
query MyGrades($courses: [String!]) {
  myGrades(courses: $courses) {
    course
    grades {
      id
      value
      studentId
      classId
    }
  }
}
```

### Analytics des notes (professeur)

```graphql
query GradeAnalytics($filter: GradeAnalyticsFilterInput) {
  gradeAnalytics(filter: $filter) {
    statistics {
      count
      averageValue
      medianValue
      lowestGrade
      highestGrade
    }
    grades {
      id
      course
      value
      studentId
      classId
    }
  }
}
```

## Notes
- Le dossier `dist/` est regenere a chaque build (`prebuild` nettoie les anciens artefacts).
- Le role utilisateur attendu est `Student` ou `Professor`.
