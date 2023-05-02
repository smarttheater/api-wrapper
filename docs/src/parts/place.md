# Data Structure

## Types.Place.SearchMovieTheaters

-   id: `xxx` (string, required) - 施設 id
    -   name
        -   ja: `xxx` (string, required) - 施設名称（日本語）
        -   en: `xxx` (string, required) - 施設名称（英語）
    -   branchCode: `xxx` (string, required) - 施設コード

## Types.Place.SearchScreeningRooms

-   name
    -   ja: `xxx` (string, required) - ルーム名称（日本語）
    -   en: `xxx` (string, required) - ルーム名称（英語）
-   branchCode: `xxx` (string, required) - ルームコード

# Group 施設

## 施設検索 [/projects/{id}/place/searchMovieTheaters{?page,limit}]

### 施設検索[GET]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id
    -   page: `1` (number, optional) - ページ
        -   Default: `1
    -   limit: `10` (number, optional) - 最大取得件数
        -   Default: `100

-   Response 200 (application/json)

    -   Attributes (array, fixed-type)
        -   (Types.Place.SearchMovieTheaters) - 施設

## ルーム検索 [/projects/{id}/place/searchScreeningRooms{?page,limit}]

### ルーム検索[GET]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id
    -   page: `1` (number, optional) - ページ
        -   Default: `1
    -   limit: `10` (number, optional) - 最大取得件数
        -   Default: `100

-   Response 200 (application/json)

    -   Attributes (array, fixed-type)
        -   (Types.Place.SearchScreeningRooms) - ルーム
