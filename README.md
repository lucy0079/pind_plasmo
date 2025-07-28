# Pind: 웹에 나만의 핀을 꽂으세요

Pind는 현재 보고 있는 웹 페이지에 핀을 꽂아 나중에 다시 보거나 다른 사람과 공유할 수 있는 브라우저 확장 프로그램입니다. 중요한 정보나 흥미로운 콘텐츠를 발견했을 때, Pind를 사용하여 해당 위치에 가상 핀을 추가하고, 언제든지 쉽게 다시 방문하거나 관리할 수 있습니다.

## 주요 기능

*   **간편한 핀 추가**: 클릭 한 번으로 현재 페이지에 핀을 추가할 수 있습니다. (예: 특정 문단, 이미지, 비디오 등)
*   **핀 목록 관리**: 확장 프로그램 팝업 창에서 추가한 핀 목록을 한눈에 확인하고, 핀을 클릭하여 해당 페이지로 이동하거나 삭제할 수 있습니다.
*   **백그라운드 데이터 관리**: 핀 데이터는 확장 프로그램 백그라운드에서 효율적으로 관리되어, 브라우저를 닫았다 열어도 핀 정보가 유지됩니다.
*   **자동 배포**: GitHub Actions를 통해 Chrome 웹 스토어에 자동으로 배포되는 CI/CD 파이프라인이 구축되어 있습니다.

## 기술 스택

*   **프레임워크**: [Plasmo](https://www.plasmo.com/) (브라우저 확장 프로그램 개발 프레임워크)
*   **UI 라이브러리**: [React](https://reactjs.org/) (UI 컴포넌트 개발)
*   **언어**: [TypeScript](https://www.typescriptlang.org/) (정적 타입 지원 JavaScript)
*   **패키지 매니저**: [pnpm](https://pnpm.io/) (빠르고 효율적인 패키지 관리)
*   **CI/CD**: [GitHub Actions](https://github.com/features/actions) (자동화된 빌드 및 배포)
*   **코드 포맷터**: [Prettier](https://prettier.io/) (일관된 코드 스타일 유지)

## 시작하기

### 사전 요구 사항

*   [Node.js](https://nodejs.org/ko/) (v16.14.0 이상 권장)
*   [pnpm](https://pnpm.io/installation) (글로벌 설치 권장: `npm install -g pnpm`)

### 설치 및 실행

1.  **저장소 복제**:
    ```bash
    git clone https://github.com/your-username/pind_plasmo-main.git # 실제 저장소 URL로 변경
    cd pind_plasmo-main
    ```

2.  **의존성 설치**:
    ```bash
    pnpm install
    ```

3.  **개발 서버 실행**:
    ```bash
    pnpm dev
    ```
    이 명령은 개발 모드로 확장 프로그램을 빌드하고, 변경 사항을 감지하여 자동으로 리로드합니다.

4.  **브라우저에 확장 프로그램 추가 (개발 모드)**:
    *   Chrome/Edge 브라우저를 엽니다.
    *   주소창에 `chrome://extensions` (Chrome) 또는 `edge://extensions` (Edge)를 입력하여 확장 프로그램 관리 페이지로 이동합니다.
    *   페이지 우측 상단 또는 좌측 상단에 있는 **개발자 모드** 토글을 활성화합니다.
    *   **압축 해제된 확장 프로그램을 로드합니다.** 버튼을 클릭합니다.
    *   프로젝트 루트 디렉토리 내의 `build/chrome-mv3-dev` 디렉토리를 선택합니다.
    *   이제 브라우저 툴바에 Pind 확장 프로그램 아이콘이 나타납니다.

## 프로젝트 구조 및 파일 설명

이 프로젝트는 Plasmo 프레임워크를 기반으로 하며, 브라우저 확장 프로그램의 핵심 구성 요소인 `background`, `content`, `popup` 스크립트를 포함합니다.

```
.
├── .github/                  # GitHub Actions 워크플로우 정의
│   └── workflows/
│       └── submit.yml        # Chrome 웹 스토어 자동 배포 워크플로우
├── .plasmo/                  # Plasmo 프레임워크 내부 파일 및 빌드 관련 캐시
│   ├── chrome-mv3.plasmo.manifest.json # Plasmo가 생성하는 Manifest V3 설정 파일
│   ├── static/               # Plasmo가 제공하는 정적 유틸리티 및 컨테이너
│   │   └── common/
│   │       ├── csui-container-react.tsx # React 기반 Content Script UI를 위한 컨테이너
│   │       ├── csui-container-vanilla.tsx # Vanilla JS 기반 Content Script UI를 위한 컨테이너
│   │       ├── csui.ts       # Content Script 관련 공통 유틸리티
│   │       ├── react.ts      # React 관련 공통 유틸리티
│   │       └── vue.ts        # Vue 관련 공통 유틸리티 (프로젝트에서 사용하지 않을 수 있음)
├── assets/                   # 확장 프로그램에서 사용되는 이미지 및 아이콘
│   ├── icon.png              # 확장 프로그램 아이콘
│   └── location.png          # 핀 위치를 나타내는 아이콘 등
├── build/                    # Plasmo 빌드 결과물이 저장되는 디렉토리 (브라우저에 로드할 확장 프로그램 파일 포함)
├── node_modules/             # pnpm에 의해 설치된 프로젝트 의존성 모듈
├── .gitignore                # Git 버전 관리에서 제외할 파일 및 디렉토리 지정
├── .prettierrc.mjs           # Prettier 코드 포맷터 설정 파일 (코드 스타일 규칙 정의)
├── background.ts             # **백그라운드 스크립트**: 확장 프로그램의 생명주기 관리, 이벤트 리스너 등록, 데이터 저장 및 관리 등 백그라운드에서 실행되는 로직을 담당합니다. (예: `chrome.storage` API를 이용한 핀 데이터 저장)
├── content.css               # **콘텐츠 스크립트 스타일**: `content.tsx`에 의해 웹 페이지에 주입되는 UI 요소들의 스타일을 정의합니다.
├── content.tsx               # **콘텐츠 스크립트**: 현재 보고 있는 웹 페이지의 DOM에 직접 접근하여 UI를 주입하거나, 페이지의 콘텐츠를 조작하는 로직을 담당합니다. (예: 핀 추가 버튼 주입, 핀 위치 표시)
├── global.d.ts               # 전역 타입 선언 파일: 프로젝트 전반에 걸쳐 사용되는 커스텀 타입이나 전역 변수 타입 등을 정의합니다.
├── package.json              # 프로젝트 메타데이터 (이름, 버전, 설명), 스크립트 (개발, 빌드 등), 프로젝트 의존성 목록 정의
├── pnpm-lock.yaml            # pnpm 패키지 매니저의 정확한 의존성 트리 및 버전 정보 기록
├── popup.css                 # **팝업 UI 스타일**: 확장 프로그램 아이콘 클릭 시 나타나는 팝업 창의 UI 요소들에 대한 스타일을 정의합니다.
├── popup.tsx                 # **팝업 UI**: 확장 프로그램 아이콘 클릭 시 나타나는 팝업 창의 사용자 인터페이스를 정의합니다. (예: 핀 목록 표시, 핀 관리 버튼)
├── README.md                 # 프로젝트에 대한 설명, 설정 및 사용법을 담은 문서 (현재 보고 계신 파일)
└── tsconfig.json             # TypeScript 컴파일러 설정 파일 (타입스크립트 코드 컴파일 방식 정의)
```

## 기여하기

Pind 프로젝트에 대한 기여는 언제든지 환영합니다! 버그 보고, 기능 제안, 코드 개선 등 어떤 형태의 기여라도 좋습니다.

1.  이 저장소를 Fork하세요.
2.  새로운 브랜치를 만드세요 (`git checkout -b feature/your-amazing-feature`).
3.  변경 사항을 커밋하세요 (`git commit -m 'feat: Add some amazing feature'`).
4.  원격 저장소에 브랜치를 Push하세요 (`git push origin feature/your-amazing-feature`).
5.  Pull Request를 열어주세요.

---