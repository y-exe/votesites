interface __BaseEnv_CloudflareEnv {
	VOTES_DB: D1Database;
	ASSETS: Fetcher;
	RESEND_EMAIL_FROM: "event@ymkw.top";
	ENTRY_FEED_URL: string;
	DISCORD_CLIENT_ID: string;
	DISCORD_CLIENT_SECRET: string;
	AUTH_SECRET: string;
	DISCORD_REDIRECT_URI: string;
	NEXT_PUBLIC_GA_ID: string;
}
declare namespace Cloudflare {
	interface GlobalProps {
		mainModule: typeof import("./.open-next/worker");
	}
	interface Env extends __BaseEnv_CloudflareEnv {}
}
interface CloudflareEnv extends __BaseEnv_CloudflareEnv {}
type StringifyValues<EnvType extends Record<string, unknown>> = {
	[Binding in keyof EnvType]: EnvType[Binding] extends string ? EnvType[Binding] : string;
};
declare namespace NodeJS {
	interface ProcessEnv extends StringifyValues<Pick<Cloudflare.Env, "RESEND_EMAIL_FROM" | "ENTRY_FEED_URL" | "DISCORD_CLIENT_ID" | "DISCORD_CLIENT_SECRET" | "AUTH_SECRET" | "DISCORD_REDIRECT_URI" | "NEXT_PUBLIC_GA_ID">> {}
}

declare var onmessage: never;
declare class DOMException extends Error {
    constructor(message?: string, name?: string);
    readonly message: string;
    readonly name: string;
    readonly code: number;
    static readonly INDEX_SIZE_ERR: number;
    static readonly DOMSTRING_SIZE_ERR: number;
    static readonly HIERARCHY_REQUEST_ERR: number;
    static readonly WRONG_DOCUMENT_ERR: number;
    static readonly INVALID_CHARACTER_ERR: number;
    static readonly NO_DATA_ALLOWED_ERR: number;
    static readonly NO_MODIFICATION_ALLOWED_ERR: number;
    static readonly NOT_FOUND_ERR: number;
    static readonly NOT_SUPPORTED_ERR: number;
    static readonly INUSE_ATTRIBUTE_ERR: number;
    static readonly INVALID_STATE_ERR: number;
    static readonly SYNTAX_ERR: number;
    static readonly INVALID_MODIFICATION_ERR: number;
    static readonly NAMESPACE_ERR: number;
    static readonly INVALID_ACCESS_ERR: number;
    static readonly VALIDATION_ERR: number;
    static readonly TYPE_MISMATCH_ERR: number;
    static readonly SECURITY_ERR: number;
    static readonly NETWORK_ERR: number;
    static readonly ABORT_ERR: number;
    static readonly URL_MISMATCH_ERR: number;
    static readonly QUOTA_EXCEEDED_ERR: number;
    static readonly TIMEOUT_ERR: number;
    static readonly INVALID_NODE_TYPE_ERR: number;
    static readonly DATA_CLONE_ERR: number;
    get stack(): any;
    set stack(value: any);
}
type WorkerGlobalScopeEventMap = {
    fetch: FetchEvent;
    scheduled: ScheduledEvent;
    queue: QueueEvent;
    unhandledrejection: PromiseRejectionEvent;
    rejectionhandled: PromiseRejectionEvent;
};
declare abstract class WorkerGlobalScope extends EventTarget<WorkerGlobalScopeEventMap> {
    EventTarget: typeof EventTarget;
}
interface Console {
    "assert"(condition?: boolean, ...data: any[]): void;
    clear(): void;
    count(label?: string): void;
    countReset(label?: string): void;
    debug(...data: any[]): void;
    dir(item?: any, options?: any): void;
    dirxml(...data: any[]): void;
    error(...data: any[]): void;
    group(...data: any[]): void;
    groupCollapsed(...data: any[]): void;
    groupEnd(): void;
    info(...data: any[]): void;
    log(...data: any[]): void;
    table(tabularData?: any, properties?: string[]): void;
    time(label?: string): void;
    timeEnd(label?: string): void;
    timeLog(label?: string, ...data: any[]): void;
    timeStamp(label?: string): void;
    trace(...data: any[]): void;
    warn(...data: any[]): void;
}
declare const console: Console;
type BufferSource = ArrayBufferView | ArrayBuffer;
type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;
declare namespace WebAssembly {
    class CompileError extends Error {
        constructor(message?: string);
    }
    class RuntimeError extends Error {
        constructor(message?: string);
    }
    type ValueType = "anyfunc" | "externref" | "f32" | "f64" | "i32" | "i64" | "v128";
    interface GlobalDescriptor {
        value: ValueType;
        mutable?: boolean;
    }
    class Global {
        constructor(descriptor: GlobalDescriptor, value?: any);
        value: any;
        valueOf(): any;
    }
    type ImportValue = ExportValue | number;
    type ModuleImports = Record<string, ImportValue>;
    type Imports = Record<string, ModuleImports>;
    type ExportValue = Function | Global | Memory | Table;
    type Exports = Record<string, ExportValue>;
    class Instance {
        constructor(module: Module, imports?: Imports);
        readonly exports: Exports;
    }
    interface MemoryDescriptor {
        initial: number;
        maximum?: number;
        shared?: boolean;
    }
    class Memory {
        constructor(descriptor: MemoryDescriptor);
        readonly buffer: ArrayBuffer;
        grow(delta: number): number;
    }
    type ImportExportKind = "function" | "global" | "memory" | "table";
    interface ModuleExportDescriptor {
        kind: ImportExportKind;
        name: string;
    }
    interface ModuleImportDescriptor {
        kind: ImportExportKind;
        module: string;
        name: string;
    }
    abstract class Module {
        static customSections(module: Module, sectionName: string): ArrayBuffer[];
        static exports(module: Module): ModuleExportDescriptor[];
        static imports(module: Module): ModuleImportDescriptor[];
    }
    type TableKind = "anyfunc" | "externref";
    interface TableDescriptor {
        element: TableKind;
        initial: number;
        maximum?: number;
    }
    class Table {
        constructor(descriptor: TableDescriptor, value?: any);
        readonly length: number;
        get(index: number): any;
        grow(delta: number, value?: any): number;
        set(index: number, value?: any): void;
    }
    function instantiate(module: Module, imports?: Imports): Promise<Instance>;
    function validate(bytes: BufferSource): boolean;
}
interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
    DOMException: typeof DOMException;
    WorkerGlobalScope: typeof WorkerGlobalScope;
    btoa(data: string): string;
    atob(data: string): string;
    setTimeout(callback: (...args: any[]) => void, msDelay?: number): number;
    setTimeout<Args extends any[]>(callback: (...args: Args) => void, msDelay?: number, ...args: Args): number;
    clearTimeout(timeoutId: number | null): void;
    setInterval(callback: (...args: any[]) => void, msDelay?: number): number;
    setInterval<Args extends any[]>(callback: (...args: Args) => void, msDelay?: number, ...args: Args): number;
    clearInterval(timeoutId: number | null): void;
    queueMicrotask(task: Function): void;
    structuredClone<T>(value: T, options?: StructuredSerializeOptions): T;
    reportError(error: any): void;
    fetch(input: RequestInfo | URL, init?: RequestInit<RequestInitCfProperties>): Promise<Response>;
    self: ServiceWorkerGlobalScope;
    crypto: Crypto;
    caches: CacheStorage;
    scheduler: Scheduler;
    performance: Performance;
    Cloudflare: Cloudflare;
    readonly origin: string;
    Event: typeof Event;
    ExtendableEvent: typeof ExtendableEvent;
    CustomEvent: typeof CustomEvent;
    PromiseRejectionEvent: typeof PromiseRejectionEvent;
    FetchEvent: typeof FetchEvent;
    TailEvent: typeof TailEvent;
    TraceEvent: typeof TailEvent;
    ScheduledEvent: typeof ScheduledEvent;
    MessageEvent: typeof MessageEvent;
    CloseEvent: typeof CloseEvent;
    ReadableStreamDefaultReader: typeof ReadableStreamDefaultReader;
    ReadableStreamBYOBReader: typeof ReadableStreamBYOBReader;
    ReadableStream: typeof ReadableStream;
    WritableStream: typeof WritableStream;
    WritableStreamDefaultWriter: typeof WritableStreamDefaultWriter;
    TransformStream: typeof TransformStream;
    ByteLengthQueuingStrategy: typeof ByteLengthQueuingStrategy;
    CountQueuingStrategy: typeof CountQueuingStrategy;
    ErrorEvent: typeof ErrorEvent;
    MessageChannel: typeof MessageChannel;
    MessagePort: typeof MessagePort;
    EventSource: typeof EventSource;
    ReadableStreamBYOBRequest: typeof ReadableStreamBYOBRequest;
    ReadableStreamDefaultController: typeof ReadableStreamDefaultController;
    ReadableByteStreamController: typeof ReadableByteStreamController;
    WritableStreamDefaultController: typeof WritableStreamDefaultController;
    TransformStreamDefaultController: typeof TransformStreamDefaultController;
    CompressionStream: typeof CompressionStream;
    DecompressionStream: typeof DecompressionStream;
    TextEncoderStream: typeof TextEncoderStream;
    TextDecoderStream: typeof TextDecoderStream;
    Headers: typeof Headers;
    Body: typeof Body;
    Request: typeof Request;
    Response: typeof Response;
    WebSocket: typeof WebSocket;
    WebSocketPair: typeof WebSocketPair;
    WebSocketRequestResponsePair: typeof WebSocketRequestResponsePair;
    AbortController: typeof AbortController;
    AbortSignal: typeof AbortSignal;
    TextDecoder: typeof TextDecoder;
    TextEncoder: typeof TextEncoder;
    navigator: Navigator;
    Navigator: typeof Navigator;
    URL: typeof URL;
    URLSearchParams: typeof URLSearchParams;
    URLPattern: typeof URLPattern;
    Blob: typeof Blob;
    File: typeof File;
    FormData: typeof FormData;
    Crypto: typeof Crypto;
    SubtleCrypto: typeof SubtleCrypto;
    CryptoKey: typeof CryptoKey;
    CacheStorage: typeof CacheStorage;
    Cache: typeof Cache;
    FixedLengthStream: typeof FixedLengthStream;
    IdentityTransformStream: typeof IdentityTransformStream;
    HTMLRewriter: typeof HTMLRewriter;
}
declare function addEventListener<Type extends keyof WorkerGlobalScopeEventMap>(type: Type, handler: EventListenerOrEventListenerObject<WorkerGlobalScopeEventMap[Type]>, options?: EventTargetAddEventListenerOptions | boolean): void;
declare function removeEventListener<Type extends keyof WorkerGlobalScopeEventMap>(type: Type, handler: EventListenerOrEventListenerObject<WorkerGlobalScopeEventMap[Type]>, options?: EventTargetEventListenerOptions | boolean): void;
declare function dispatchEvent(event: WorkerGlobalScopeEventMap[keyof WorkerGlobalScopeEventMap]): boolean;
declare function btoa(data: string): string;
declare function atob(data: string): string;
declare function setTimeout(callback: (...args: any[]) => void, msDelay?: number): number;
declare function setTimeout<Args extends any[]>(callback: (...args: Args) => void, msDelay?: number, ...args: Args): number;
declare function clearTimeout(timeoutId: number | null): void;
declare function setInterval(callback: (...args: any[]) => void, msDelay?: number): number;
declare function setInterval<Args extends any[]>(callback: (...args: Args) => void, msDelay?: number, ...args: Args): number;
declare function clearInterval(timeoutId: number | null): void;
declare function queueMicrotask(task: Function): void;
declare function structuredClone<T>(value: T, options?: StructuredSerializeOptions): T;
declare function reportError(error: any): void;
declare function fetch(input: RequestInfo | URL, init?: RequestInit<RequestInitCfProperties>): Promise<Response>;
declare const self: ServiceWorkerGlobalScope;
declare const crypto: Crypto;
declare const caches: CacheStorage;
declare const scheduler: Scheduler;
declare const performance: Performance;
declare const Cloudflare: Cloudflare;
declare const origin: string;
declare const navigator: Navigator;
interface TestController {
}
interface ExecutionContext<Props = unknown> {
    waitUntil(promise: Promise<any>): void;
    passThroughOnException(): void;
    readonly exports: Cloudflare.Exports;
    readonly props: Props;
    cache?: CacheContext;
    readonly access?: CloudflareAccessContext;
    tracing: Tracing;
}
type ExportedHandlerFetchHandler<Env = unknown, CfHostMetadata = unknown, Props = unknown> = (request: Request<CfHostMetadata, IncomingRequestCfProperties<CfHostMetadata>>, env: Env, ctx: ExecutionContext<Props>) => Response | Promise<Response>;
type ExportedHandlerConnectHandler<Env = unknown, Props = unknown> = (socket: Socket, env: Env, ctx: ExecutionContext<Props>) => void | Promise<void>;
type ExportedHandlerTailHandler<Env = unknown, Props = unknown> = (events: TraceItem[], env: Env, ctx: ExecutionContext<Props>) => void | Promise<void>;
type ExportedHandlerTraceHandler<Env = unknown, Props = unknown> = (traces: TraceItem[], env: Env, ctx: ExecutionContext<Props>) => void | Promise<void>;
type ExportedHandlerTailStreamHandler<Env = unknown, Props = unknown> = (event: TailStream.TailEvent<TailStream.Onset>, env: Env, ctx: ExecutionContext<Props>) => TailStream.TailEventHandlerType | Promise<TailStream.TailEventHandlerType>;
type ExportedHandlerScheduledHandler<Env = unknown, Props = unknown> = (controller: ScheduledController, env: Env, ctx: ExecutionContext<Props>) => void | Promise<void>;
type ExportedHandlerQueueHandler<Env = unknown, Message = unknown, Props = unknown> = (batch: MessageBatch<Message>, env: Env, ctx: ExecutionContext<Props>) => void | Promise<void>;
type ExportedHandlerTestHandler<Env = unknown, Props = unknown> = (controller: TestController, env: Env, ctx: ExecutionContext<Props>) => void | Promise<void>;
interface ExportedHandler<Env = unknown, QueueHandlerMessage = unknown, CfHostMetadata = unknown, Props = unknown> {
    fetch?: ExportedHandlerFetchHandler<Env, CfHostMetadata, Props>;
    connect?: ExportedHandlerConnectHandler<Env, Props>;
    tail?: ExportedHandlerTailHandler<Env, Props>;
    trace?: ExportedHandlerTraceHandler<Env, Props>;
    tailStream?: ExportedHandlerTailStreamHandler<Env, Props>;
    scheduled?: ExportedHandlerScheduledHandler<Env, Props>;
    test?: ExportedHandlerTestHandler<Env, Props>;
    email?: EmailExportedHandler<Env, Props>;
    queue?: ExportedHandlerQueueHandler<Env, QueueHandlerMessage, Props>;
}
interface StructuredSerializeOptions {
    transfer?: any[];
}
declare abstract class Navigator {
    sendBeacon(url: string, body?: BodyInit): boolean;
    readonly userAgent: string;
    readonly hardwareConcurrency: number;
    readonly platform: string;
    readonly language: string;
    readonly languages: string[];
}
interface AlarmInvocationInfo {
    readonly isRetry: boolean;
    readonly retryCount: number;
    readonly scheduledTime: number;
}
interface Cloudflare {
    readonly compatibilityFlags: Record<string, boolean>;
}
interface CachePurgeError {
    code: number;
    message: string;
}
interface CachePurgeResult {
    success: boolean;
    errors: CachePurgeError[];
}
interface CachePurgeOptions {
    tags?: string[];
    pathPrefixes?: string[];
    purgeEverything?: boolean;
}
interface CacheContext {
    purge(options: CachePurgeOptions): Promise<CachePurgeResult>;
}
interface CloudflareAccessContext {
    readonly aud: string;
    getIdentity(): Promise<CloudflareAccessIdentity | undefined>;
}
declare abstract class ColoLocalActorNamespace {
    get(actorId: string): Fetcher;
}
interface DurableObject {
    fetch(request: Request): Response | Promise<Response>;
    connect?(socket: Socket): void | Promise<void>;
    alarm?(alarmInfo?: AlarmInvocationInfo): void | Promise<void>;
    webSocketMessage?(ws: WebSocket, message: string | ArrayBuffer): void | Promise<void>;
    webSocketClose?(ws: WebSocket, code: number, reason: string, wasClean: boolean): void | Promise<void>;
    webSocketError?(ws: WebSocket, error: unknown): void | Promise<void>;
}
type DurableObjectStub<T extends Rpc.DurableObjectBranded | undefined = undefined> = Fetcher<T, "alarm" | "connect" | "webSocketMessage" | "webSocketClose" | "webSocketError"> & {
    readonly id: DurableObjectId;
    readonly name?: string;
};
interface DurableObjectId {
    toString(): string;
    equals(other: DurableObjectId): boolean;
    readonly name?: string;
    readonly jurisdiction?: string;
}
declare abstract class DurableObjectNamespace<T extends Rpc.DurableObjectBranded | undefined = undefined> {
    newUniqueId(options?: DurableObjectNamespaceNewUniqueIdOptions): DurableObjectId;
    idFromName(name: string): DurableObjectId;
    idFromString(id: string): DurableObjectId;
    get(id: DurableObjectId, options?: DurableObjectNamespaceGetDurableObjectOptions): DurableObjectStub<T>;
    getByName(name: string, options?: DurableObjectNamespaceGetDurableObjectOptions): DurableObjectStub<T>;
    jurisdiction(jurisdiction: DurableObjectJurisdiction): DurableObjectNamespace<T>;
}
type DurableObjectJurisdiction = "eu" | "fedramp" | "fedramp-high" | "us";
interface DurableObjectNamespaceNewUniqueIdOptions {
    jurisdiction?: DurableObjectJurisdiction;
}
type DurableObjectLocationHint = "wnam" | "enam" | "sam" | "weur" | "eeur" | "apac" | "apac-ne" | "apac-se" | "oc" | "afr" | "me";
type DurableObjectRoutingMode = "primary-only";
interface DurableObjectNamespaceGetDurableObjectOptions {
    locationHint?: DurableObjectLocationHint;
    routingMode?: DurableObjectRoutingMode;
}
interface DurableObjectClass<_T extends Rpc.DurableObjectBranded | undefined = undefined> {
}
interface DurableObjectState<Props = unknown> {
    waitUntil(promise: Promise<any>): void;
    readonly exports: Cloudflare.Exports;
    readonly props: Props;
    readonly id: DurableObjectId;
    readonly storage: DurableObjectStorage;
    container?: Container;
    facets: DurableObjectFacets;
    blockConcurrencyWhile<T>(callback: () => Promise<T>): Promise<T>;
    acceptWebSocket(ws: WebSocket, tags?: string[]): void;
    getWebSockets(tag?: string): WebSocket[];
    setWebSocketAutoResponse(maybeReqResp?: WebSocketRequestResponsePair): void;
    getWebSocketAutoResponse(): WebSocketRequestResponsePair | null;
    getWebSocketAutoResponseTimestamp(ws: WebSocket): Date | null;
    setHibernatableWebSocketEventTimeout(timeoutMs?: number): void;
    getHibernatableWebSocketEventTimeout(): number | null;
    getTags(ws: WebSocket): string[];
    abort(reason?: string): void;
}
interface DurableObjectTransaction {
    get<T = unknown>(key: string, options?: DurableObjectGetOptions): Promise<T | undefined>;
    get<T = unknown>(keys: string[], options?: DurableObjectGetOptions): Promise<Map<string, T>>;
    list<T = unknown>(options?: DurableObjectListOptions): Promise<Map<string, T>>;
    put<T>(key: string, value: T, options?: DurableObjectPutOptions): Promise<void>;
    put<T>(entries: Record<string, T>, options?: DurableObjectPutOptions): Promise<void>;
    delete(key: string, options?: DurableObjectPutOptions): Promise<boolean>;
    delete(keys: string[], options?: DurableObjectPutOptions): Promise<number>;
    rollback(): void;
    getAlarm(options?: DurableObjectGetAlarmOptions): Promise<number | null>;
    setAlarm(scheduledTime: number | Date, options?: DurableObjectSetAlarmOptions): Promise<void>;
    deleteAlarm(options?: DurableObjectSetAlarmOptions): Promise<void>;
}
interface DurableObjectStorage {
    get<T = unknown>(key: string, options?: DurableObjectGetOptions): Promise<T | undefined>;
    get<T = unknown>(keys: string[], options?: DurableObjectGetOptions): Promise<Map<string, T>>;
    list<T = unknown>(options?: DurableObjectListOptions): Promise<Map<string, T>>;
    put<T>(key: string, value: T, options?: DurableObjectPutOptions): Promise<void>;
    put<T>(entries: Record<string, T>, options?: DurableObjectPutOptions): Promise<void>;
    delete(key: string, options?: DurableObjectPutOptions): Promise<boolean>;
    delete(keys: string[], options?: DurableObjectPutOptions): Promise<number>;
    deleteAll(options?: DurableObjectPutOptions): Promise<void>;
    transaction<T>(closure: (txn: DurableObjectTransaction) => Promise<T>): Promise<T>;
    getAlarm(options?: DurableObjectGetAlarmOptions): Promise<number | null>;
    setAlarm(scheduledTime: number | Date, options?: DurableObjectSetAlarmOptions): Promise<void>;
    deleteAlarm(options?: DurableObjectSetAlarmOptions): Promise<void>;
    sync(): Promise<void>;
    sql: SqlStorage;
    kv: SyncKvStorage;
    transactionSync<T>(closure: () => T): T;
    getCurrentBookmark(): Promise<string>;
    getBookmarkForTime(timestamp: number | Date): Promise<string>;
    onNextSessionRestoreBookmark(bookmark: string): Promise<string>;
}
interface DurableObjectListOptions {
    start?: string;
    startAfter?: string;
    end?: string;
    prefix?: string;
    reverse?: boolean;
    limit?: number;
    allowConcurrency?: boolean;
    noCache?: boolean;
}
interface DurableObjectGetOptions {
    allowConcurrency?: boolean;
    noCache?: boolean;
}
interface DurableObjectGetAlarmOptions {
    allowConcurrency?: boolean;
}
interface DurableObjectPutOptions {
    allowConcurrency?: boolean;
    allowUnconfirmed?: boolean;
    noCache?: boolean;
}
interface DurableObjectSetAlarmOptions {
    allowConcurrency?: boolean;
    allowUnconfirmed?: boolean;
}
declare class WebSocketRequestResponsePair {
    constructor(request: string, response: string);
    get request(): string;
    get response(): string;
}
interface DurableObjectFacets {
    get<T extends Rpc.DurableObjectBranded | undefined = undefined>(name: string, getStartupOptions: () => FacetStartupOptions<T> | Promise<FacetStartupOptions<T>>): Fetcher<T>;
    abort(name: string, reason: any): void;
    delete(name: string): void;
    clone(src: string, dst: string): void;
}
interface FacetStartupOptions<T extends Rpc.DurableObjectBranded | undefined = undefined> {
    id?: DurableObjectId | string;
    class: DurableObjectClass<T>;
}
interface AnalyticsEngineDataset {
    writeDataPoint(event?: AnalyticsEngineDataPoint): void;
}
interface AnalyticsEngineDataPoint {
    indexes?: ((ArrayBuffer | string) | null)[];
    doubles?: number[];
    blobs?: ((ArrayBuffer | string) | null)[];
}
declare class Event {
    constructor(type: string, init?: EventInit);
    get type(): string;
    get eventPhase(): number;
    get composed(): boolean;
    get bubbles(): boolean;
    get cancelable(): boolean;
    get defaultPrevented(): boolean;
    get returnValue(): boolean;
    get currentTarget(): EventTarget | undefined;
    get target(): EventTarget | undefined;
    get srcElement(): EventTarget | undefined;
    get timeStamp(): number;
    get isTrusted(): boolean;
    get cancelBubble(): boolean;
    set cancelBubble(value: boolean);
    stopImmediatePropagation(): void;
    preventDefault(): void;
    stopPropagation(): void;
    composedPath(): EventTarget[];
    static readonly NONE: number;
    static readonly CAPTURING_PHASE: number;
    static readonly AT_TARGET: number;
    static readonly BUBBLING_PHASE: number;
}
interface EventInit {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
}
type EventListener<EventType extends Event = Event> = (event: EventType) => void;
interface EventListenerObject<EventType extends Event = Event> {
    handleEvent(event: EventType): void;
}
type EventListenerOrEventListenerObject<EventType extends Event = Event> = EventListener<EventType> | EventListenerObject<EventType>;
declare class EventTarget<EventMap extends Record<string, Event> = Record<string, Event>> {
    constructor();
    addEventListener<Type extends keyof EventMap>(type: Type, handler: EventListenerOrEventListenerObject<EventMap[Type]>, options?: EventTargetAddEventListenerOptions | boolean): void;
    removeEventListener<Type extends keyof EventMap>(type: Type, handler: EventListenerOrEventListenerObject<EventMap[Type]>, options?: EventTargetEventListenerOptions | boolean): void;
    dispatchEvent(event: EventMap[keyof EventMap]): boolean;
}
interface EventTargetEventListenerOptions {
    capture?: boolean;
}
interface EventTargetAddEventListenerOptions {
    capture?: boolean;
    passive?: boolean;
    once?: boolean;
    signal?: AbortSignal;
}
interface EventTargetHandlerObject {
    handleEvent: (event: Event) => any | undefined;
}
declare class AbortController {
    constructor();
    get signal(): AbortSignal;
    abort(reason?: any): void;
}
declare abstract class AbortSignal extends EventTarget {
    static abort(reason?: any): AbortSignal;
    static timeout(delay: number): AbortSignal;
    static any(signals: AbortSignal[]): AbortSignal;
    get aborted(): boolean;
    get reason(): any;
    get onabort(): any | null;
    set onabort(value: any | null);
    throwIfAborted(): void;
}
interface Scheduler {
    wait(delay: number, maybeOptions?: SchedulerWaitOptions): Promise<void>;
}
interface SchedulerWaitOptions {
    signal?: AbortSignal;
}
declare abstract class ExtendableEvent extends Event {
    waitUntil(promise: Promise<any>): void;
}
declare class CustomEvent<T = any> extends Event {
    constructor(type: string, init?: CustomEventCustomEventInit);
    get detail(): T;
}
interface CustomEventCustomEventInit {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
    detail?: any;
}
declare class Blob {
    constructor(bits?: ((ArrayBuffer | ArrayBufferView) | string | Blob)[], options?: BlobOptions);
    get size(): number;
    get type(): string;
    slice(start?: number, end?: number, type?: string): Blob;
    arrayBuffer(): Promise<ArrayBuffer>;
    bytes(): Promise<Uint8Array>;
    text(): Promise<string>;
    stream(): ReadableStream;
}
interface BlobOptions {
    type?: string;
}
declare class File extends Blob {
    constructor(bits: ((ArrayBuffer | ArrayBufferView) | string | Blob)[] | undefined, name: string, options?: FileOptions);
    get name(): string;
    get lastModified(): number;
}
interface FileOptions {
    type?: string;
    lastModified?: number;
}
declare abstract class CacheStorage {
    open(cacheName: string): Promise<Cache>;
    readonly default: Cache;
}
declare abstract class Cache {
    delete(request: RequestInfo | URL, options?: CacheQueryOptions): Promise<boolean>;
    match(request: RequestInfo | URL, options?: CacheQueryOptions): Promise<Response | undefined>;
    put(request: RequestInfo | URL, response: Response): Promise<void>;
}
interface CacheQueryOptions {
    ignoreMethod?: boolean;
}
declare abstract class Crypto {
    get subtle(): SubtleCrypto;
    getRandomValues<T extends Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | BigInt64Array | BigUint64Array>(buffer: T): T;
    randomUUID(): string;
    DigestStream: typeof DigestStream;
}
declare abstract class SubtleCrypto {
    encrypt(algorithm: string | SubtleCryptoEncryptAlgorithm, key: CryptoKey, plainText: ArrayBuffer | ArrayBufferView): Promise<ArrayBuffer>;
    decrypt(algorithm: string | SubtleCryptoEncryptAlgorithm, key: CryptoKey, cipherText: ArrayBuffer | ArrayBufferView): Promise<ArrayBuffer>;
    sign(algorithm: string | SubtleCryptoSignAlgorithm, key: CryptoKey, data: ArrayBuffer | ArrayBufferView): Promise<ArrayBuffer>;
    verify(algorithm: string | SubtleCryptoSignAlgorithm, key: CryptoKey, signature: ArrayBuffer | ArrayBufferView, data: ArrayBuffer | ArrayBufferView): Promise<boolean>;
    digest(algorithm: string | SubtleCryptoHashAlgorithm, data: ArrayBuffer | ArrayBufferView): Promise<ArrayBuffer>;
    generateKey(algorithm: string | SubtleCryptoGenerateKeyAlgorithm, extractable: boolean, keyUsages: string[]): Promise<CryptoKey | CryptoKeyPair>;
    deriveKey(algorithm: string | SubtleCryptoDeriveKeyAlgorithm, baseKey: CryptoKey, derivedKeyAlgorithm: string | SubtleCryptoImportKeyAlgorithm, extractable: boolean, keyUsages: string[]): Promise<CryptoKey>;
    deriveBits(algorithm: string | SubtleCryptoDeriveKeyAlgorithm, baseKey: CryptoKey, length?: number | null): Promise<ArrayBuffer>;
    importKey(format: string, keyData: (ArrayBuffer | ArrayBufferView) | JsonWebKey, algorithm: string | SubtleCryptoImportKeyAlgorithm, extractable: boolean, keyUsages: string[]): Promise<CryptoKey>;
    exportKey(format: string, key: CryptoKey): Promise<ArrayBuffer | JsonWebKey>;
    wrapKey(format: string, key: CryptoKey, wrappingKey: CryptoKey, wrapAlgorithm: string | SubtleCryptoEncryptAlgorithm): Promise<ArrayBuffer>;
    unwrapKey(format: string, wrappedKey: ArrayBuffer | ArrayBufferView, unwrappingKey: CryptoKey, unwrapAlgorithm: string | SubtleCryptoEncryptAlgorithm, unwrappedKeyAlgorithm: string | SubtleCryptoImportKeyAlgorithm, extractable: boolean, keyUsages: string[]): Promise<CryptoKey>;
    timingSafeEqual(a: ArrayBuffer | ArrayBufferView, b: ArrayBuffer | ArrayBufferView): boolean;
}
declare abstract class CryptoKey {
    readonly type: string;
    readonly extractable: boolean;
    readonly algorithm: CryptoKeyKeyAlgorithm | CryptoKeyAesKeyAlgorithm | CryptoKeyHmacKeyAlgorithm | CryptoKeyRsaKeyAlgorithm | CryptoKeyEllipticKeyAlgorithm | CryptoKeyArbitraryKeyAlgorithm;
    readonly usages: string[];
}
interface CryptoKeyPair {
    publicKey: CryptoKey;
    privateKey: CryptoKey;
}
interface JsonWebKey {
    kty: string;
    use?: string;
    key_ops?: string[];
    alg?: string;
    ext?: boolean;
    crv?: string;
    x?: string;
    y?: string;
    d?: string;
    n?: string;
    e?: string;
    p?: string;
    q?: string;
    dp?: string;
    dq?: string;
    qi?: string;
    oth?: RsaOtherPrimesInfo[];
    k?: string;
}
interface RsaOtherPrimesInfo {
    r?: string;
    d?: string;
    t?: string;
}
interface SubtleCryptoDeriveKeyAlgorithm {
    name: string;
    salt?: (ArrayBuffer | ArrayBufferView);
    iterations?: number;
    hash?: (string | SubtleCryptoHashAlgorithm);
    $public?: CryptoKey;
    info?: (ArrayBuffer | ArrayBufferView);
}
interface SubtleCryptoEncryptAlgorithm {
    name: string;
    iv?: (ArrayBuffer | ArrayBufferView);
    additionalData?: (ArrayBuffer | ArrayBufferView);
    tagLength?: number;
    counter?: (ArrayBuffer | ArrayBufferView);
    length?: number;
    label?: (ArrayBuffer | ArrayBufferView);
}
interface SubtleCryptoGenerateKeyAlgorithm {
    name: string;
    hash?: (string | SubtleCryptoHashAlgorithm);
    modulusLength?: number;
    publicExponent?: (ArrayBuffer | ArrayBufferView);
    length?: number;
    namedCurve?: string;
}
interface SubtleCryptoHashAlgorithm {
    name: string;
}
interface SubtleCryptoImportKeyAlgorithm {
    name: string;
    hash?: (string | SubtleCryptoHashAlgorithm);
    length?: number;
    namedCurve?: string;
    compressed?: boolean;
}
interface SubtleCryptoSignAlgorithm {
    name: string;
    hash?: (string | SubtleCryptoHashAlgorithm);
    dataLength?: number;
    saltLength?: number;
}
interface CryptoKeyKeyAlgorithm {
    name: string;
}
interface CryptoKeyAesKeyAlgorithm {
    name: string;
    length: number;
}
interface CryptoKeyHmacKeyAlgorithm {
    name: string;
    hash: CryptoKeyKeyAlgorithm;
    length: number;
}
interface CryptoKeyRsaKeyAlgorithm {
    name: string;
    modulusLength: number;
    publicExponent: ArrayBuffer | ArrayBufferView;
    hash?: CryptoKeyKeyAlgorithm;
}
interface CryptoKeyEllipticKeyAlgorithm {
    name: string;
    namedCurve: string;
}
interface CryptoKeyArbitraryKeyAlgorithm {
    name: string;
    hash?: CryptoKeyKeyAlgorithm;
    namedCurve?: string;
    length?: number;
}
declare class DigestStream extends WritableStream<ArrayBuffer | ArrayBufferView> {
    constructor(algorithm: string | SubtleCryptoHashAlgorithm);
    readonly digest: Promise<ArrayBuffer>;
    get bytesWritten(): number | bigint;
}
declare class TextDecoder {
    constructor(label?: string, options?: TextDecoderConstructorOptions);
    decode(input?: (ArrayBuffer | ArrayBufferView), options?: TextDecoderDecodeOptions): string;
    get encoding(): string;
    get fatal(): boolean;
    get ignoreBOM(): boolean;
}
declare class TextEncoder {
    constructor();
    encode(input?: string): Uint8Array;
    encodeInto(input: string, buffer: Uint8Array): TextEncoderEncodeIntoResult;
    get encoding(): string;
}
interface TextDecoderConstructorOptions {
    fatal: boolean;
    ignoreBOM: boolean;
}
interface TextDecoderDecodeOptions {
    stream: boolean;
}
interface TextEncoderEncodeIntoResult {
    read: number;
    written: number;
}
declare class ErrorEvent extends Event {
    constructor(type: string, init?: ErrorEventErrorEventInit);
    get filename(): string;
    get message(): string;
    get lineno(): number;
    get colno(): number;
    get error(): any;
}
interface ErrorEventErrorEventInit {
    message?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    error?: any;
}
declare class MessageEvent extends Event {
    constructor(type: string, initializer: MessageEventInit);
    readonly data: any;
    readonly origin: string | null;
    readonly lastEventId: string;
    readonly source: MessagePort | null;
    readonly ports: MessagePort[];
}
interface MessageEventInit {
    data: ArrayBuffer | string;
}
declare abstract class PromiseRejectionEvent extends Event {
    readonly promise: Promise<any>;
    readonly reason: any;
}
declare class FormData {
    constructor();
    append(name: string, value: string | Blob): void;
    append(name: string, value: string): void;
    append(name: string, value: Blob, filename?: string): void;
    delete(name: string): void;
    get(name: string): (File | string) | null;
    getAll(name: string): (File | string)[];
    has(name: string): boolean;
    set(name: string, value: string | Blob): void;
    set(name: string, value: string): void;
    set(name: string, value: Blob, filename?: string): void;
    entries(): IterableIterator<[
        key: string,
        value: File | string
    ]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<(File | string)>;
    forEach<This = unknown>(callback: (this: This, value: File | string, key: string, parent: FormData) => void, thisArg?: This): void;
    [Symbol.iterator](): IterableIterator<[
        key: string,
        value: File | string
    ]>;
}
interface ContentOptions {
    html?: boolean;
}
declare class HTMLRewriter {
    constructor();
    on(selector: string, handlers: HTMLRewriterElementContentHandlers): HTMLRewriter;
    onDocument(handlers: HTMLRewriterDocumentContentHandlers): HTMLRewriter;
    transform(response: Response): Response;
}
interface HTMLRewriterElementContentHandlers {
    element?(element: Element): void | Promise<void>;
    comments?(comment: Comment): void | Promise<void>;
    text?(element: Text): void | Promise<void>;
}
interface HTMLRewriterDocumentContentHandlers {
    doctype?(doctype: Doctype): void | Promise<void>;
    comments?(comment: Comment): void | Promise<void>;
    text?(text: Text): void | Promise<void>;
    end?(end: DocumentEnd): void | Promise<void>;
}
interface Doctype {
    readonly name: string | null;
    readonly publicId: string | null;
    readonly systemId: string | null;
}
interface Element {
    tagName: string;
    readonly attributes: IterableIterator<string[]>;
    readonly removed: boolean;
    readonly namespaceURI: string;
    getAttribute(name: string): string | null;
    hasAttribute(name: string): boolean;
    setAttribute(name: string, value: string): Element;
    removeAttribute(name: string): Element;
    before(content: string | ReadableStream | Response, options?: ContentOptions): Element;
    after(content: string | ReadableStream | Response, options?: ContentOptions): Element;
    prepend(content: string | ReadableStream | Response, options?: ContentOptions): Element;
    append(content: string | ReadableStream | Response, options?: ContentOptions): Element;
    replace(content: string | ReadableStream | Response, options?: ContentOptions): Element;
    remove(): Element;
    removeAndKeepContent(): Element;
    setInnerContent(content: string | ReadableStream | Response, options?: ContentOptions): Element;
    onEndTag(handler: (tag: EndTag) => void | Promise<void>): void;
}
interface EndTag {
    name: string;
    before(content: string | ReadableStream | Response, options?: ContentOptions): EndTag;
    after(content: string | ReadableStream | Response, options?: ContentOptions): EndTag;
    remove(): EndTag;
}
interface Comment {
    text: string;
    readonly removed: boolean;
    before(content: string, options?: ContentOptions): Comment;
    after(content: string, options?: ContentOptions): Comment;
    replace(content: string, options?: ContentOptions): Comment;
    remove(): Comment;
}
interface Text {
    readonly text: string;
    readonly lastInTextNode: boolean;
    readonly removed: boolean;
    before(content: string | ReadableStream | Response, options?: ContentOptions): Text;
    after(content: string | ReadableStream | Response, options?: ContentOptions): Text;
    replace(content: string | ReadableStream | Response, options?: ContentOptions): Text;
    remove(): Text;
}
interface DocumentEnd {
    append(content: string, options?: ContentOptions): DocumentEnd;
}
declare abstract class FetchEvent extends ExtendableEvent {
    readonly request: Request;
    respondWith(promise: Response | Promise<Response>): void;
    passThroughOnException(): void;
}
type HeadersInit = Headers | Iterable<Iterable<string>> | Record<string, string>;
declare class Headers {
    constructor(init?: HeadersInit);
    get(name: string): string | null;
    getAll(name: string): string[];
    getSetCookie(): string[];
    has(name: string): boolean;
    set(name: string, value: string): void;
    append(name: string, value: string): void;
    delete(name: string): void;
    forEach<This = unknown>(callback: (this: This, value: string, key: string, parent: Headers) => void, thisArg?: This): void;
    entries(): IterableIterator<[
        key: string,
        value: string
    ]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    [Symbol.iterator](): IterableIterator<[
        key: string,
        value: string
    ]>;
}
type BodyInit = ReadableStream<Uint8Array> | string | ArrayBuffer | ArrayBufferView | Blob | URLSearchParams | FormData | Iterable<ArrayBuffer | ArrayBufferView> | AsyncIterable<ArrayBuffer | ArrayBufferView>;
declare abstract class Body {
    get body(): ReadableStream | null;
    get bodyUsed(): boolean;
    arrayBuffer(): Promise<ArrayBuffer>;
    bytes(): Promise<Uint8Array>;
    text(): Promise<string>;
    json<T>(): Promise<T>;
    formData(): Promise<FormData>;
    blob(): Promise<Blob>;
}
declare var Response: {
    prototype: Response;
    new (body?: BodyInit | null, init?: ResponseInit): Response;
    error(): Response;
    redirect(url: string, status?: number): Response;
    json(any: any, maybeInit?: (ResponseInit | Response)): Response;
};
interface Response extends Body {
    clone(): Response;
    status: number;
    statusText: string;
    headers: Headers;
    ok: boolean;
    redirected: boolean;
    url: string;
    webSocket: WebSocket | null;
    cf: any | undefined;
    type: "default" | "error";
}
interface ResponseInit {
    status?: number;
    statusText?: string;
    headers?: HeadersInit;
    cf?: any;
    webSocket?: (WebSocket | null);
    encodeBody?: "automatic" | "manual";
}
type RequestInfo<CfHostMetadata = unknown, Cf = CfProperties<CfHostMetadata>> = Request<CfHostMetadata, Cf> | string;
declare var Request: {
    prototype: Request;
    new <CfHostMetadata = unknown, Cf = CfProperties<CfHostMetadata>>(input: RequestInfo<CfProperties> | URL, init?: RequestInit<Cf>): Request<CfHostMetadata, Cf>;
};
interface Request<CfHostMetadata = unknown, Cf = CfProperties<CfHostMetadata>> extends Body {
    clone(): Request<CfHostMetadata, Cf>;
    method: string;
    url: string;
    headers: Headers;
    redirect: string;
    fetcher: Fetcher | null;
    signal: AbortSignal;
    cf?: Cf;
    integrity: string;
    keepalive: boolean;
    cache?: "no-store" | "no-cache";
}
interface RequestInit<Cf = CfProperties> {
    method?: string;
    headers?: HeadersInit;
    body?: BodyInit | null;
    redirect?: string;
    fetcher?: (Fetcher | null);
    cf?: Cf;
    cache?: "no-store" | "no-cache";
    integrity?: string;
    signal?: (AbortSignal | null);
    encodeResponseBody?: "automatic" | "manual";
}
type Service<T extends (new (...args: any[]) => Rpc.WorkerEntrypointBranded) | Rpc.WorkerEntrypointBranded | ExportedHandler<any, any, any> | undefined = undefined> = T extends new (...args: any[]) => Rpc.WorkerEntrypointBranded ? Fetcher<InstanceType<T>> : T extends Rpc.WorkerEntrypointBranded ? Fetcher<T> : T extends Exclude<Rpc.EntrypointBranded, Rpc.WorkerEntrypointBranded> ? never : Fetcher<undefined>;
type Fetcher<T extends Rpc.EntrypointBranded | undefined = undefined, Reserved extends string = never> = (T extends Rpc.EntrypointBranded ? Rpc.Provider<T, Reserved | "fetch" | "connect"> : unknown) & {
    fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
    connect(address: SocketAddress | string, options?: SocketOptions): Socket;
};
interface KVNamespaceListKey<Metadata, Key extends string = string> {
    name: Key;
    expiration?: number;
    metadata?: Metadata;
}
type KVNamespaceListResult<Metadata, Key extends string = string> = {
    list_complete: false;
    keys: KVNamespaceListKey<Metadata, Key>[];
    cursor: string;
    cacheStatus: string | null;
} | {
    list_complete: true;
    keys: KVNamespaceListKey<Metadata, Key>[];
    cacheStatus: string | null;
};
interface KVNamespace<Key extends string = string> {
    get(key: Key, options?: Partial<KVNamespaceGetOptions<undefined>>): Promise<string | null>;
    get(key: Key, type: "text"): Promise<string | null>;
    get<ExpectedValue = unknown>(key: Key, type: "json"): Promise<ExpectedValue | null>;
    get(key: Key, type: "arrayBuffer"): Promise<ArrayBuffer | null>;
    get(key: Key, type: "stream"): Promise<ReadableStream | null>;
    get(key: Key, options?: KVNamespaceGetOptions<"text">): Promise<string | null>;
    get<ExpectedValue = unknown>(key: Key, options?: KVNamespaceGetOptions<"json">): Promise<ExpectedValue | null>;
    get(key: Key, options?: KVNamespaceGetOptions<"arrayBuffer">): Promise<ArrayBuffer | null>;
    get(key: Key, options?: KVNamespaceGetOptions<"stream">): Promise<ReadableStream | null>;
    get(key: Array<Key>, type: "text"): Promise<Map<string, string | null>>;
    get<ExpectedValue = unknown>(key: Array<Key>, type: "json"): Promise<Map<string, ExpectedValue | null>>;
    get(key: Array<Key>, options?: Partial<KVNamespaceGetOptions<undefined>>): Promise<Map<string, string | null>>;
    get(key: Array<Key>, options?: KVNamespaceGetOptions<"text">): Promise<Map<string, string | null>>;
    get<ExpectedValue = unknown>(key: Array<Key>, options?: KVNamespaceGetOptions<"json">): Promise<Map<string, ExpectedValue | null>>;
    list<Metadata = unknown>(options?: KVNamespaceListOptions): Promise<KVNamespaceListResult<Metadata, Key>>;
    put(key: Key, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options?: KVNamespacePutOptions): Promise<void>;
    getWithMetadata<Metadata = unknown>(key: Key, options?: Partial<KVNamespaceGetOptions<undefined>>): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>;
    getWithMetadata<Metadata = unknown>(key: Key, type: "text"): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>;
    getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(key: Key, type: "json"): Promise<KVNamespaceGetWithMetadataResult<ExpectedValue, Metadata>>;
    getWithMetadata<Metadata = unknown>(key: Key, type: "arrayBuffer"): Promise<KVNamespaceGetWithMetadataResult<ArrayBuffer, Metadata>>;
    getWithMetadata<Metadata = unknown>(key: Key, type: "stream"): Promise<KVNamespaceGetWithMetadataResult<ReadableStream, Metadata>>;
    getWithMetadata<Metadata = unknown>(key: Key, options: KVNamespaceGetOptions<"text">): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>;
    getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(key: Key, options: KVNamespaceGetOptions<"json">): Promise<KVNamespaceGetWithMetadataResult<ExpectedValue, Metadata>>;
    getWithMetadata<Metadata = unknown>(key: Key, options: KVNamespaceGetOptions<"arrayBuffer">): Promise<KVNamespaceGetWithMetadataResult<ArrayBuffer, Metadata>>;
    getWithMetadata<Metadata = unknown>(key: Key, options: KVNamespaceGetOptions<"stream">): Promise<KVNamespaceGetWithMetadataResult<ReadableStream, Metadata>>;
    getWithMetadata<Metadata = unknown>(key: Array<Key>, type: "text"): Promise<Map<string, KVNamespaceGetWithMetadataResult<string, Metadata>>>;
    getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(key: Array<Key>, type: "json"): Promise<Map<string, KVNamespaceGetWithMetadataResult<ExpectedValue, Metadata>>>;
    getWithMetadata<Metadata = unknown>(key: Array<Key>, options?: Partial<KVNamespaceGetOptions<undefined>>): Promise<Map<string, KVNamespaceGetWithMetadataResult<string, Metadata>>>;
    getWithMetadata<Metadata = unknown>(key: Array<Key>, options?: KVNamespaceGetOptions<"text">): Promise<Map<string, KVNamespaceGetWithMetadataResult<string, Metadata>>>;
    getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(key: Array<Key>, options?: KVNamespaceGetOptions<"json">): Promise<Map<string, KVNamespaceGetWithMetadataResult<ExpectedValue, Metadata>>>;
    delete(key: Key): Promise<void>;
}
interface KVNamespaceListOptions {
    limit?: number;
    prefix?: (string | null);
    cursor?: (string | null);
}
interface KVNamespaceGetOptions<Type> {
    type: Type;
    cacheTtl?: number;
}
interface KVNamespacePutOptions {
    expiration?: number;
    expirationTtl?: number;
    metadata?: (any | null);
}
interface KVNamespaceGetWithMetadataResult<Value, Metadata> {
    value: Value | null;
    metadata: Metadata | null;
    cacheStatus: string | null;
}
type QueueContentType = "text" | "bytes" | "json" | "v8";
interface Queue<Body = unknown> {
    metrics(): Promise<QueueMetrics>;
    send(message: Body, options?: QueueSendOptions): Promise<QueueSendResponse>;
    sendBatch(messages: Iterable<MessageSendRequest<Body>>, options?: QueueSendBatchOptions): Promise<QueueSendBatchResponse>;
}
interface QueueSendMetrics {
    backlogCount: number;
    backlogBytes: number;
    oldestMessageTimestamp?: Date;
}
interface QueueSendMetadata {
    metrics: QueueSendMetrics;
}
interface QueueSendResponse {
    metadata: QueueSendMetadata;
}
interface QueueSendBatchMetrics {
    backlogCount: number;
    backlogBytes: number;
    oldestMessageTimestamp?: Date;
}
interface QueueSendBatchMetadata {
    metrics: QueueSendBatchMetrics;
}
interface QueueSendBatchResponse {
    metadata: QueueSendBatchMetadata;
}
interface QueueSendOptions {
    contentType?: QueueContentType;
    delaySeconds?: number;
}
interface QueueSendBatchOptions {
    delaySeconds?: number;
}
interface MessageSendRequest<Body = unknown> {
    body: Body;
    contentType?: QueueContentType;
    delaySeconds?: number;
}
interface QueueMetrics {
    backlogCount: number;
    backlogBytes: number;
    oldestMessageTimestamp?: Date;
}
interface MessageBatchMetrics {
    backlogCount: number;
    backlogBytes: number;
    oldestMessageTimestamp?: Date;
}
interface MessageBatchMetadata {
    metrics: MessageBatchMetrics;
}
interface QueueRetryOptions {
    delaySeconds?: number;
}
interface Message<Body = unknown> {
    readonly id: string;
    readonly timestamp: Date;
    readonly body: Body;
    readonly attempts: number;
    retry(options?: QueueRetryOptions): void;
    ack(): void;
}
interface QueueEvent<Body = unknown> extends ExtendableEvent {
    readonly messages: readonly Message<Body>[];
    readonly queue: string;
    readonly metadata: MessageBatchMetadata;
    retryAll(options?: QueueRetryOptions): void;
    ackAll(): void;
}
interface MessageBatch<Body = unknown> {
    readonly messages: readonly Message<Body>[];
    readonly queue: string;
    readonly metadata: MessageBatchMetadata;
    retryAll(options?: QueueRetryOptions): void;
    ackAll(): void;
}
interface R2Error extends Error {
    readonly name: string;
    readonly code: number;
    readonly message: string;
    readonly action: string;
    readonly stack: any;
}
interface R2ListOptions {
    limit?: number;
    prefix?: string;
    cursor?: string;
    delimiter?: string;
    startAfter?: string;
    include?: ("httpMetadata" | "customMetadata")[];
}
interface R2Bucket {
    head(key: string): Promise<R2Object | null>;
    get(key: string, options: R2GetOptions & {
        onlyIf: R2Conditional | Headers;
    }): Promise<R2ObjectBody | R2Object | null>;
    get(key: string, options?: R2GetOptions): Promise<R2ObjectBody | null>;
    put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob, options?: R2PutOptions & {
        onlyIf: R2Conditional | Headers;
    }): Promise<R2Object | null>;
    put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob, options?: R2PutOptions): Promise<R2Object>;
    createMultipartUpload(key: string, options?: R2MultipartOptions): Promise<R2MultipartUpload>;
    resumeMultipartUpload(key: string, uploadId: string): R2MultipartUpload;
    delete(keys: string | string[]): Promise<void>;
    list(options?: R2ListOptions): Promise<R2Objects>;
}
interface R2MultipartUpload {
    readonly key: string;
    readonly uploadId: string;
    uploadPart(partNumber: number, value: ReadableStream | (ArrayBuffer | ArrayBufferView) | string | Blob, options?: R2UploadPartOptions): Promise<R2UploadedPart>;
    abort(): Promise<void>;
    complete(uploadedParts: R2UploadedPart[]): Promise<R2Object>;
}
interface R2UploadedPart {
    partNumber: number;
    etag: string;
}
declare abstract class R2Object {
    readonly key: string;
    readonly version: string;
    readonly size: number;
    readonly etag: string;
    readonly httpEtag: string;
    readonly checksums: R2Checksums;
    readonly uploaded: Date;
    readonly httpMetadata?: R2HTTPMetadata;
    readonly customMetadata?: Record<string, string>;
    readonly range?: R2Range;
    readonly storageClass: string;
    readonly ssecKeyMd5?: string;
    writeHttpMetadata(headers: Headers): void;
}
interface R2ObjectBody extends R2Object {
    get body(): ReadableStream;
    get bodyUsed(): boolean;
    arrayBuffer(): Promise<ArrayBuffer>;
    bytes(): Promise<Uint8Array>;
    text(): Promise<string>;
    json<T>(): Promise<T>;
    blob(): Promise<Blob>;
}
type R2Range = {
    offset: number;
    length?: number;
} | {
    offset?: number;
    length: number;
} | {
    suffix: number;
};
interface R2Conditional {
    etagMatches?: string;
    etagDoesNotMatch?: string;
    uploadedBefore?: Date;
    uploadedAfter?: Date;
    secondsGranularity?: boolean;
}
interface R2GetOptions {
    onlyIf?: (R2Conditional | Headers);
    range?: (R2Range | Headers);
    ssecKey?: (ArrayBuffer | string);
}
interface R2PutOptions {
    onlyIf?: (R2Conditional | Headers);
    httpMetadata?: (R2HTTPMetadata | Headers);
    customMetadata?: Record<string, string>;
    md5?: ((ArrayBuffer | ArrayBufferView) | string);
    sha1?: ((ArrayBuffer | ArrayBufferView) | string);
    sha256?: ((ArrayBuffer | ArrayBufferView) | string);
    sha384?: ((ArrayBuffer | ArrayBufferView) | string);
    sha512?: ((ArrayBuffer | ArrayBufferView) | string);
    storageClass?: string;
    ssecKey?: (ArrayBuffer | string);
}
interface R2MultipartOptions {
    httpMetadata?: (R2HTTPMetadata | Headers);
    customMetadata?: Record<string, string>;
    storageClass?: string;
    ssecKey?: (ArrayBuffer | string);
}
interface R2Checksums {
    readonly md5?: ArrayBuffer;
    readonly sha1?: ArrayBuffer;
    readonly sha256?: ArrayBuffer;
    readonly sha384?: ArrayBuffer;
    readonly sha512?: ArrayBuffer;
    toJSON(): R2StringChecksums;
}
interface R2StringChecksums {
    md5?: string;
    sha1?: string;
    sha256?: string;
    sha384?: string;
    sha512?: string;
}
interface R2HTTPMetadata {
    contentType?: string;
    contentLanguage?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    cacheControl?: string;
    cacheExpiry?: Date;
}
type R2Objects = {
    objects: R2Object[];
    delimitedPrefixes: string[];
} & ({
    truncated: true;
    cursor: string;
} | {
    truncated: false;
});
interface R2UploadPartOptions {
    ssecKey?: (ArrayBuffer | string);
}
declare abstract class ScheduledEvent extends ExtendableEvent {
    readonly scheduledTime: number;
    readonly cron: string;
    noRetry(): void;
}
interface ScheduledController {
    readonly scheduledTime: number;
    readonly cron: string;
    noRetry(): void;
}
interface QueuingStrategy<T = any> {
    highWaterMark?: (number | bigint);
    size?: (chunk: T) => number | bigint;
}
interface UnderlyingSink<W = any> {
    type?: string;
    start?: (controller: WritableStreamDefaultController) => void | Promise<void>;
    write?: (chunk: W, controller: WritableStreamDefaultController) => void | Promise<void>;
    abort?: (reason: any) => void | Promise<void>;
    close?: () => void | Promise<void>;
}
interface UnderlyingByteSource {
    type: "bytes";
    autoAllocateChunkSize?: number;
    start?: (controller: ReadableByteStreamController) => void | Promise<void>;
    pull?: (controller: ReadableByteStreamController) => void | Promise<void>;
    cancel?: (reason: any) => void | Promise<void>;
}
interface UnderlyingSource<R = any> {
    type?: "" | undefined;
    start?: (controller: ReadableStreamDefaultController<R>) => void | Promise<void>;
    pull?: (controller: ReadableStreamDefaultController<R>) => void | Promise<void>;
    cancel?: (reason: any) => void | Promise<void>;
    expectedLength?: (number | bigint);
}
interface Transformer<I = any, O = any> {
    readableType?: string;
    writableType?: string;
    start?: (controller: TransformStreamDefaultController<O>) => void | Promise<void>;
    transform?: (chunk: I, controller: TransformStreamDefaultController<O>) => void | Promise<void>;
    flush?: (controller: TransformStreamDefaultController<O>) => void | Promise<void>;
    cancel?: (reason: any) => void | Promise<void>;
    expectedLength?: number;
}
interface StreamPipeOptions {
    preventAbort?: boolean;
    preventCancel?: boolean;
    preventClose?: boolean;
    signal?: AbortSignal;
}
type ReadableStreamReadResult<R = any> = {
    done: false;
    value: R;
} | {
    done: true;
    value?: undefined;
};
interface ReadableStream<R = any> {
    get locked(): boolean;
    cancel(reason?: any): Promise<void>;
    getReader(): ReadableStreamDefaultReader<R>;
    getReader(options: ReadableStreamGetReaderOptions): ReadableStreamBYOBReader;
    pipeThrough<T>(transform: ReadableWritablePair<T, R>, options?: StreamPipeOptions): ReadableStream<T>;
    pipeTo(destination: WritableStream<R>, options?: StreamPipeOptions): Promise<void>;
    tee(): [
        ReadableStream<R>,
        ReadableStream<R>
    ];
    values(options?: ReadableStreamValuesOptions): AsyncIterableIterator<R>;
    [Symbol.asyncIterator](options?: ReadableStreamValuesOptions): AsyncIterableIterator<R>;
}
declare const ReadableStream: {
    prototype: ReadableStream;
    new (underlyingSource: UnderlyingByteSource, strategy?: QueuingStrategy<Uint8Array>): ReadableStream<Uint8Array>;
    new <R = any>(underlyingSource?: UnderlyingSource<R>, strategy?: QueuingStrategy<R>): ReadableStream<R>;
};
declare class ReadableStreamDefaultReader<R = any> {
    constructor(stream: ReadableStream);
    get closed(): Promise<void>;
    cancel(reason?: any): Promise<void>;
    read(): Promise<ReadableStreamReadResult<R>>;
    releaseLock(): void;
}
declare class ReadableStreamBYOBReader {
    constructor(stream: ReadableStream);
    get closed(): Promise<void>;
    cancel(reason?: any): Promise<void>;
    read<T extends ArrayBufferView>(view: T): Promise<ReadableStreamReadResult<T>>;
    releaseLock(): void;
    readAtLeast<T extends ArrayBufferView>(minElements: number, view: T): Promise<ReadableStreamReadResult<T>>;
}
interface ReadableStreamBYOBReaderReadableStreamBYOBReaderReadOptions {
    min?: number;
}
interface ReadableStreamGetReaderOptions {
    mode: "byob";
}
declare abstract class ReadableStreamBYOBRequest {
    get view(): Uint8Array | null;
    respond(bytesWritten: number): void;
    respondWithNewView(view: ArrayBuffer | ArrayBufferView): void;
    get atLeast(): number | null;
}
declare abstract class ReadableStreamDefaultController<R = any> {
    get desiredSize(): number | null;
    close(): void;
    enqueue(chunk?: R): void;
    error(reason: any): void;
}
declare abstract class ReadableByteStreamController {
    get byobRequest(): ReadableStreamBYOBRequest | null;
    get desiredSize(): number | null;
    close(): void;
    enqueue(chunk: ArrayBuffer | ArrayBufferView): void;
    error(reason: any): void;
}
declare abstract class WritableStreamDefaultController {
    get signal(): AbortSignal;
    error(reason?: any): void;
}
declare abstract class TransformStreamDefaultController<O = any> {
    get desiredSize(): number | null;
    enqueue(chunk?: O): void;
    error(reason: any): void;
    terminate(): void;
}
interface ReadableWritablePair<R = any, W = any> {
    readable: ReadableStream<R>;
    writable: WritableStream<W>;
}
declare class WritableStream<W = any> {
    constructor(underlyingSink?: UnderlyingSink, queuingStrategy?: QueuingStrategy);
    get locked(): boolean;
    abort(reason?: any): Promise<void>;
    close(): Promise<void>;
    getWriter(): WritableStreamDefaultWriter<W>;
}
declare class WritableStreamDefaultWriter<W = any> {
    constructor(stream: WritableStream);
    get closed(): Promise<void>;
    get ready(): Promise<void>;
    get desiredSize(): number | null;
    abort(reason?: any): Promise<void>;
    close(): Promise<void>;
    write(chunk?: W): Promise<void>;
    releaseLock(): void;
}
declare class TransformStream<I = any, O = any> {
    constructor(transformer?: Transformer<I, O>, writableStrategy?: QueuingStrategy<I>, readableStrategy?: QueuingStrategy<O>);
    get readable(): ReadableStream<O>;
    get writable(): WritableStream<I>;
}
declare class FixedLengthStream extends IdentityTransformStream {
    constructor(expectedLength: number | bigint, queuingStrategy?: IdentityTransformStreamQueuingStrategy);
}
declare class IdentityTransformStream extends TransformStream<ArrayBuffer | ArrayBufferView, Uint8Array> {
    constructor(queuingStrategy?: IdentityTransformStreamQueuingStrategy);
}
interface IdentityTransformStreamQueuingStrategy {
    highWaterMark?: (number | bigint);
}
interface ReadableStreamValuesOptions {
    preventCancel?: boolean;
}
declare class CompressionStream extends TransformStream<ArrayBuffer | ArrayBufferView, Uint8Array> {
    constructor(format: "gzip" | "deflate" | "deflate-raw");
}
declare class DecompressionStream extends TransformStream<ArrayBuffer | ArrayBufferView, Uint8Array> {
    constructor(format: "gzip" | "deflate" | "deflate-raw");
}
declare class TextEncoderStream extends TransformStream<string, Uint8Array> {
    constructor();
    get encoding(): string;
}
declare class TextDecoderStream extends TransformStream<ArrayBuffer | ArrayBufferView, string> {
    constructor(label?: string, options?: TextDecoderStreamTextDecoderStreamInit);
    get encoding(): string;
    get fatal(): boolean;
    get ignoreBOM(): boolean;
}
interface TextDecoderStreamTextDecoderStreamInit {
    fatal?: boolean;
    ignoreBOM?: boolean;
}
declare class ByteLengthQueuingStrategy implements QueuingStrategy<ArrayBufferView> {
    constructor(init: QueuingStrategyInit);
    get highWaterMark(): number;
    get size(): (chunk?: any) => number;
}
declare class CountQueuingStrategy implements QueuingStrategy {
    constructor(init: QueuingStrategyInit);
    get highWaterMark(): number;
    get size(): (chunk?: any) => number;
}
interface QueuingStrategyInit {
    highWaterMark: number;
}
interface TracePreviewInfo {
    id: string;
    slug: string;
    name: string;
}
interface ScriptVersion {
    id?: string;
    tag?: string;
    message?: string;
}
declare abstract class TailEvent extends ExtendableEvent {
    readonly events: TraceItem[];
    readonly traces: TraceItem[];
}
interface TraceItem {
    readonly event: (TraceItemFetchEventInfo | TraceItemJsRpcEventInfo | TraceItemConnectEventInfo | TraceItemScheduledEventInfo | TraceItemAlarmEventInfo | TraceItemQueueEventInfo | TraceItemEmailEventInfo | TraceItemTailEventInfo | TraceItemCustomEventInfo | TraceItemHibernatableWebSocketEventInfo) | null;
    readonly eventTimestamp: number | null;
    readonly logs: TraceLog[];
    readonly exceptions: TraceException[];
    readonly diagnosticsChannelEvents: TraceDiagnosticChannelEvent[];
    readonly scriptName: string | null;
    readonly entrypoint?: string;
    readonly scriptVersion?: ScriptVersion;
    readonly dispatchNamespace?: string;
    readonly scriptTags?: string[];
    readonly tailAttributes?: Record<string, boolean | number | string>;
    readonly preview?: TracePreviewInfo;
    readonly durableObjectId?: string;
    readonly outcome: string;
    readonly executionModel: string;
    readonly truncated: boolean;
    readonly cpuTime: number;
    readonly wallTime: number;
}
interface TraceItemAlarmEventInfo {
    readonly scheduledTime: Date;
}
interface TraceItemConnectEventInfo {
}
interface TraceItemCustomEventInfo {
}
interface TraceItemScheduledEventInfo {
    readonly scheduledTime: number;
    readonly cron: string;
}
interface TraceItemQueueEventInfo {
    readonly queue: string;
    readonly batchSize: number;
}
interface TraceItemEmailEventInfo {
    readonly mailFrom: string;
    readonly rcptTo: string;
    readonly rawSize: number;
}
interface TraceItemTailEventInfo {
    readonly consumedEvents: TraceItemTailEventInfoTailItem[];
}
interface TraceItemTailEventInfoTailItem {
    readonly scriptName: string | null;
}
interface TraceItemFetchEventInfo {
    readonly response?: TraceItemFetchEventInfoResponse;
    readonly request: TraceItemFetchEventInfoRequest;
}
interface TraceItemFetchEventInfoRequest {
    readonly cf?: any;
    readonly headers: Record<string, string>;
    readonly method: string;
    readonly url: string;
    getUnredacted(): TraceItemFetchEventInfoRequest;
}
interface TraceItemFetchEventInfoResponse {
    readonly status: number;
}
interface TraceItemJsRpcEventInfo {
    readonly rpcMethod: string;
}
interface TraceItemHibernatableWebSocketEventInfo {
    readonly getWebSocketEvent: TraceItemHibernatableWebSocketEventInfoMessage | TraceItemHibernatableWebSocketEventInfoClose | TraceItemHibernatableWebSocketEventInfoError;
}
interface TraceItemHibernatableWebSocketEventInfoMessage {
    readonly webSocketEventType: string;
}
interface TraceItemHibernatableWebSocketEventInfoClose {
    readonly webSocketEventType: string;
    readonly code: number;
    readonly wasClean: boolean;
}
interface TraceItemHibernatableWebSocketEventInfoError {
    readonly webSocketEventType: string;
}
interface TraceLog {
    readonly timestamp: number;
    readonly level: string;
    readonly message: any;
}
interface TraceException {
    readonly timestamp: number;
    readonly message: string;
    readonly name: string;
    readonly stack?: string;
}
interface TraceDiagnosticChannelEvent {
    readonly timestamp: number;
    readonly channel: string;
    readonly message: any;
}
interface TraceMetrics {
    readonly cpuTime: number;
    readonly wallTime: number;
}
interface UnsafeTraceMetrics {
    fromTrace(item: TraceItem): TraceMetrics;
}
declare class URL {
    constructor(url: string | URL, base?: string | URL);
    get origin(): string;
    get href(): string;
    set href(value: string);
    get protocol(): string;
    set protocol(value: string);
    get username(): string;
    set username(value: string);
    get password(): string;
    set password(value: string);
    get host(): string;
    set host(value: string);
    get hostname(): string;
    set hostname(value: string);
    get port(): string;
    set port(value: string);
    get pathname(): string;
    set pathname(value: string);
    get search(): string;
    set search(value: string);
    get hash(): string;
    set hash(value: string);
    get searchParams(): URLSearchParams;
    toJSON(): string;
    toString(): string;
    static canParse(url: string, base?: string): boolean;
    static parse(url: string, base?: string): URL | null;
    static createObjectURL(object: File | Blob): string;
    static revokeObjectURL(object_url: string): void;
}
declare class URLSearchParams {
    constructor(init?: (Iterable<Iterable<string>> | Record<string, string> | string));
    get size(): number;
    append(name: string, value: string): void;
    delete(name: string, value?: string): void;
    get(name: string): string | null;
    getAll(name: string): string[];
    has(name: string, value?: string): boolean;
    set(name: string, value: string): void;
    sort(): void;
    entries(): IterableIterator<[
        key: string,
        value: string
    ]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    forEach<This = unknown>(callback: (this: This, value: string, key: string, parent: URLSearchParams) => void, thisArg?: This): void;
    toString(): string;
    [Symbol.iterator](): IterableIterator<[
        key: string,
        value: string
    ]>;
}
declare class URLPattern {
    constructor(input?: (string | URLPatternInit), baseURL?: (string | URLPatternOptions), patternOptions?: URLPatternOptions);
    get protocol(): string;
    get username(): string;
    get password(): string;
    get hostname(): string;
    get port(): string;
    get pathname(): string;
    get search(): string;
    get hash(): string;
    get hasRegExpGroups(): boolean;
    test(input?: (string | URLPatternInit), baseURL?: string): boolean;
    exec(input?: (string | URLPatternInit), baseURL?: string): URLPatternResult | null;
}
interface URLPatternInit {
    protocol?: string;
    username?: string;
    password?: string;
    hostname?: string;
    port?: string;
    pathname?: string;
    search?: string;
    hash?: string;
    baseURL?: string;
}
interface URLPatternComponentResult {
    input: string;
    groups: Record<string, string>;
}
interface URLPatternResult {
    inputs: (string | URLPatternInit)[];
    protocol: URLPatternComponentResult;
    username: URLPatternComponentResult;
    password: URLPatternComponentResult;
    hostname: URLPatternComponentResult;
    port: URLPatternComponentResult;
    pathname: URLPatternComponentResult;
    search: URLPatternComponentResult;
    hash: URLPatternComponentResult;
}
interface URLPatternOptions {
    ignoreCase?: boolean;
}
declare class CloseEvent extends Event {
    constructor(type: string, initializer?: CloseEventInit);
    readonly code: number;
    readonly reason: string;
    readonly wasClean: boolean;
}
interface CloseEventInit {
    code?: number;
    reason?: string;
    wasClean?: boolean;
}
type WebSocketEventMap = {
    close: CloseEvent;
    message: MessageEvent;
    open: Event;
    error: ErrorEvent;
};
declare var WebSocket: {
    prototype: WebSocket;
    new (url: string, protocols?: (string[] | string)): WebSocket;
    readonly READY_STATE_CONNECTING: number;
    readonly CONNECTING: number;
    readonly READY_STATE_OPEN: number;
    readonly OPEN: number;
    readonly READY_STATE_CLOSING: number;
    readonly CLOSING: number;
    readonly READY_STATE_CLOSED: number;
    readonly CLOSED: number;
};
interface WebSocket extends EventTarget<WebSocketEventMap> {
    accept(options?: WebSocketAcceptOptions): void;
    send(message: (ArrayBuffer | ArrayBufferView) | string): void;
    close(code?: number, reason?: string): void;
    serializeAttachment(attachment: any): void;
    deserializeAttachment(): any | null;
    readyState: number;
    url: string | null;
    protocol: string | null;
    extensions: string | null;
    binaryType: "blob" | "arraybuffer";
}
interface WebSocketAcceptOptions {
    allowHalfOpen?: boolean;
}
declare const WebSocketPair: {
    new (): {
        0: WebSocket;
        1: WebSocket;
    };
};
interface SqlStorage {
    exec<T extends Record<string, SqlStorageValue>>(query: string, ...bindings: any[]): SqlStorageCursor<T>;
    get databaseSize(): number;
    Cursor: typeof SqlStorageCursor;
    Statement: typeof SqlStorageStatement;
}
declare abstract class SqlStorageStatement {
}
type SqlStorageValue = ArrayBuffer | string | number | null;
declare abstract class SqlStorageCursor<T extends Record<string, SqlStorageValue>> {
    next(): {
        done?: false;
        value: T;
    } | {
        done: true;
        value?: never;
    };
    toArray(): T[];
    one(): T;
    raw<U extends SqlStorageValue[]>(): IterableIterator<U>;
    columnNames: string[];
    get rowsRead(): number;
    get rowsWritten(): number;
    [Symbol.iterator](): IterableIterator<T>;
}
interface Socket {
    get readable(): ReadableStream;
    get writable(): WritableStream;
    get closed(): Promise<void>;
    get opened(): Promise<SocketInfo>;
    get upgraded(): boolean;
    get secureTransport(): "on" | "off" | "starttls";
    close(): Promise<void>;
    startTls(options?: TlsOptions): Socket;
}
interface SocketOptions {
    secureTransport?: string;
    allowHalfOpen: boolean;
    highWaterMark?: (number | bigint);
}
interface SocketAddress {
    hostname: string;
    port: number;
}
interface TlsOptions {
    expectedServerHostname?: string;
}
interface SocketInfo {
    remoteAddress?: string;
    localAddress?: string;
}
declare class EventSource extends EventTarget {
    constructor(url: string, init?: EventSourceEventSourceInit);
    close(): void;
    get url(): string;
    get withCredentials(): boolean;
    get readyState(): number;
    get onopen(): any | null;
    set onopen(value: any | null);
    get onmessage(): any | null;
    set onmessage(value: any | null);
    get onerror(): any | null;
    set onerror(value: any | null);
    static readonly CONNECTING: number;
    static readonly OPEN: number;
    static readonly CLOSED: number;
    static from(stream: ReadableStream): EventSource;
}
interface EventSourceEventSourceInit {
    withCredentials?: boolean;
    fetcher?: Fetcher;
}
interface ExecOutput {
    readonly stdout: ArrayBuffer;
    readonly stderr: ArrayBuffer;
    readonly exitCode: number;
}
interface ContainerExecOptions {
    cwd?: string;
    env?: Record<string, string>;
    user?: string;
    stdin?: ReadableStream | "pipe";
    stdout?: "pipe" | "ignore";
    stderr?: "pipe" | "ignore" | "combined";
}
interface ExecProcess {
    readonly stdin: WritableStream | null;
    readonly stdout: ReadableStream | null;
    readonly stderr: ReadableStream | null;
    readonly pid: number;
    readonly exitCode: Promise<number>;
    output(): Promise<ExecOutput>;
    kill(signal?: number): void;
}
interface Container {
    get running(): boolean;
    start(options?: ContainerStartupOptions): void;
    monitor(): Promise<void>;
    destroy(error?: any): Promise<void>;
    signal(signo: number): void;
    getTcpPort(port: number): Fetcher;
    setInactivityTimeout(durationMs: number | bigint): Promise<void>;
    interceptOutboundHttp(addr: string, binding: Fetcher): Promise<void>;
    interceptAllOutboundHttp(binding: Fetcher): Promise<void>;
    snapshotDirectory(options: ContainerDirectorySnapshotOptions): Promise<ContainerDirectorySnapshot>;
    snapshotContainer(options: ContainerSnapshotOptions): Promise<ContainerSnapshot>;
    interceptOutboundHttps(addr: string, binding: Fetcher): Promise<void>;
    exec(cmd: string[], options?: ContainerExecOptions): Promise<ExecProcess>;
}
interface ContainerDirectorySnapshot {
    id: string;
    size: number;
    dir: string;
    name?: string;
}
interface ContainerDirectorySnapshotOptions {
    dir: string;
    name?: string;
}
interface ContainerDirectorySnapshotRestoreParams {
    snapshot: ContainerDirectorySnapshot;
    mountPoint?: string;
}
interface ContainerSnapshot {
    id: string;
    size: number;
    name?: string;
}
interface ContainerSnapshotOptions {
    name?: string;
}
interface ContainerStartupOptions {
    entrypoint?: string[];
    enableInternet: boolean;
    env?: Record<string, string>;
    labels?: Record<string, string>;
    directorySnapshots?: ContainerDirectorySnapshotRestoreParams[];
    containerSnapshot?: ContainerSnapshot;
}
declare abstract class MessagePort extends EventTarget {
    postMessage(data?: any, options?: (any[] | MessagePortPostMessageOptions)): void;
    close(): void;
    start(): void;
    get onmessage(): any | null;
    set onmessage(value: any | null);
}
declare class MessageChannel {
    constructor();
    readonly port1: MessagePort;
    readonly port2: MessagePort;
}
interface MessagePortPostMessageOptions {
    transfer?: any[];
}
type LoopbackForExport<T extends (new (...args: any[]) => Rpc.EntrypointBranded) | ExportedHandler<any, any, any> | undefined = undefined> = T extends new (...args: any[]) => Rpc.WorkerEntrypointBranded ? LoopbackServiceStub<InstanceType<T>> : T extends new (...args: any[]) => Rpc.DurableObjectBranded ? LoopbackDurableObjectClass<InstanceType<T>> : T extends ExportedHandler<any, any, any> ? LoopbackServiceStub<undefined> : undefined;
type LoopbackServiceStub<T extends Rpc.WorkerEntrypointBranded | undefined = undefined> = Fetcher<T> & (T extends CloudflareWorkersModule.WorkerEntrypoint<any, infer Props> ? (opts: {
    props?: Props;
}) => Fetcher<T> : (opts: {
    props?: any;
}) => Fetcher<T>);
type LoopbackDurableObjectClass<T extends Rpc.DurableObjectBranded | undefined = undefined> = DurableObjectClass<T> & (T extends CloudflareWorkersModule.DurableObject<any, infer Props> ? (opts: {
    props?: Props;
}) => DurableObjectClass<T> : (opts: {
    props?: any;
}) => DurableObjectClass<T>);
interface LoopbackDurableObjectNamespace extends DurableObjectNamespace {
}
interface LoopbackColoLocalActorNamespace extends ColoLocalActorNamespace {
}
interface SyncKvStorage {
    get<T = unknown>(key: string): T | undefined;
    list<T = unknown>(options?: SyncKvListOptions): Iterable<[
        string,
        T
    ]>;
    put<T>(key: string, value: T): void;
    delete(key: string): boolean;
}
interface SyncKvListOptions {
    start?: string;
    startAfter?: string;
    end?: string;
    prefix?: string;
    reverse?: boolean;
    limit?: number;
}
interface WorkerStub {
    getEntrypoint<T extends Rpc.WorkerEntrypointBranded | undefined>(name?: string, options?: WorkerStubEntrypointOptions): Fetcher<T>;
    getDurableObjectClass<T extends Rpc.DurableObjectBranded | undefined>(name?: string, options?: WorkerStubEntrypointOptions): DurableObjectClass<T>;
}
interface WorkerStubEntrypointOptions {
    props?: any;
    limits?: workerdResourceLimits;
}
interface WorkerLoader {
    get(name: string | null, getCode: () => WorkerLoaderWorkerCode | Promise<WorkerLoaderWorkerCode>): WorkerStub;
    load(code: WorkerLoaderWorkerCode): WorkerStub;
}
interface WorkerLoaderModule {
    js?: string;
    cjs?: string;
    text?: string;
    data?: ArrayBuffer;
    json?: any;
    py?: string;
    wasm?: ArrayBuffer;
}
interface WorkerLoaderWorkerCode {
    compatibilityDate: string;
    compatibilityFlags?: string[];
    allowExperimental?: boolean;
    limits?: workerdResourceLimits;
    mainModule: string;
    modules: Record<string, WorkerLoaderModule | string>;
    env?: any;
    globalOutbound?: (Fetcher | null);
    tails?: Fetcher[];
    streamingTails?: Fetcher[];
}
interface workerdResourceLimits {
    cpuMs?: number;
    subRequests?: number;
}
declare abstract class Performance {
    get timeOrigin(): number;
    now(): number;
    toJSON(): object;
}
interface Tracing {
    enterSpan<T, A extends unknown[]>(name: string, callback: (span: Span, ...args: A) => T, ...args: A): T;
    startActiveSpan<T, A extends unknown[]>(name: string, callback: (span: Span, ...args: A) => T, ...args: A): T;
    Span: typeof Span;
}
declare abstract class Span {
    get isTraced(): boolean;
    setAttribute(key: string, value?: (boolean | number | string)): void;
    end(): void;
}
interface CloudflareAccessIdentity extends Record<string, unknown> {
    email?: string;
    name?: string;
    user_uuid?: string;
    account_id?: string;
    iat?: number;
    ip?: string;
    amr?: string[];
    idp?: {
        id: string;
        type: string;
    };
    geo?: {
        country: string;
    };
    groups?: Array<{
        id: string;
        name: string;
        email?: string;
    }>;
    devicePosture?: Record<string, unknown>;
    is_warp?: boolean;
    is_gateway?: boolean;
}
type AgentMemoryMemoryType = "fact" | "event" | "instruction" | "task";
type AgentMemoryThinkingLevel = "low" | "medium" | "high";
type AgentMemoryResponseLength = "short" | "medium" | "long";
interface AgentMemoryMessage {
    role: "system" | "user" | "assistant";
    content: string;
    timestamp?: Date;
}
interface AgentMemoryIncomingMemory {
    content: string;
    sessionId?: string | null | undefined;
}
interface AgentMemoryMemory {
    id: string;
    type: AgentMemoryMemoryType;
    summary: string;
    content: string;
    sessionId: string | null;
    createdAt: Date;
    updatedAt: Date;
}
type AgentMemoryMemoryListEntry = Omit<AgentMemoryMemory, "content">;
interface AgentMemoryScoredCandidate {
    id: string;
    summary: string;
    sessionId: string | null;
    score: number;
}
interface AgentMemoryIngestOptions {
    sessionId?: string | null | undefined;
}
interface AgentMemoryGetSummaryOptions {
    sessionId?: string | null | undefined;
}
interface AgentMemoryGetSummaryResponse {
    summary: string;
}
interface AgentMemoryRecallOptions {
    thinkingLevel?: AgentMemoryThinkingLevel;
    responseLength?: AgentMemoryResponseLength;
    referenceDate?: Date | string;
}
interface AgentMemoryRecallResult {
    count: number;
    answer: string;
    candidates: AgentMemoryScoredCandidate[];
}
interface AgentMemoryListMemoriesOptions {
    limit?: number;
    cursor?: string;
    sessionId?: string;
    type?: AgentMemoryMemoryType;
}
interface AgentMemoryListMemoriesResult {
    memories: AgentMemoryMemoryListEntry[];
    cursor?: string;
}
declare abstract class AgentMemoryProfile {
    get(memoryId: string): Promise<AgentMemoryMemory>;
    delete(memoryId: string): Promise<AgentMemoryMemory>;
    remember(memory: AgentMemoryIncomingMemory): Promise<AgentMemoryMemory>;
    ingest(messages: Iterable<AgentMemoryMessage>, options?: AgentMemoryIngestOptions): Promise<void>;
    getSummary(options?: AgentMemoryGetSummaryOptions): Promise<AgentMemoryGetSummaryResponse>;
    recall(query: string, options?: AgentMemoryRecallOptions): Promise<AgentMemoryRecallResult>;
    list(options?: AgentMemoryListMemoriesOptions): Promise<AgentMemoryListMemoriesResult>;
    deleteSession(sessionId: string): Promise<void>;
}
declare abstract class AgentMemoryNamespace {
    getProfile(profileName: string): Promise<AgentMemoryProfile>;
    deleteProfile(profileName: string): Promise<void>;
}
interface AiSearchInternalError extends Error {
}
interface AiSearchNotFoundError extends Error {
}
type AiSearchMessage = {
    role: 'system' | 'developer' | 'user' | 'assistant' | 'tool';
    content: string | null;
};
type AiSearchOptions = {
    retrieval?: {
        retrieval_type?: 'vector' | 'keyword' | 'hybrid';
        fusion_method?: 'max' | 'rrf';
        keyword_match_mode?: 'and' | 'or';
        match_threshold?: number;
        max_num_results?: number;
        filters?: VectorizeVectorMetadataFilter;
        context_expansion?: number;
        metadata_only?: boolean;
        return_on_failure?: boolean;
        boost_by?: Array<{
            field: string;
            direction?: 'asc' | 'desc' | 'exists' | 'not_exists';
        }>;
        [key: string]: unknown;
    };
    query_rewrite?: {
        enabled?: boolean;
        model?: string;
        rewrite_prompt?: string;
        [key: string]: unknown;
    };
    reranking?: {
        enabled?: boolean;
        model?: string;
        match_threshold?: number;
        [key: string]: unknown;
    };
    cache?: {
        enabled?: boolean;
        cache_threshold?: 'super_strict_match' | 'close_enough' | 'flexible_friend' | 'anything_goes';
    };
    [key: string]: unknown;
};
type AiSearchSearchRequest = {
    query: string;
    messages?: never;
    ai_search_options?: AiSearchOptions;
} | {
    query?: never;
    messages: AiSearchMessage[];
    ai_search_options?: AiSearchOptions;
};
type AiSearchChatCompletionsRequest = {
    messages: AiSearchMessage[];
    model?: string;
    stream?: boolean;
    ai_search_options?: AiSearchOptions;
    [key: string]: unknown;
};
type AiSearchMultiSearchOptions = AiSearchOptions & {
    instance_ids: string[];
};
type AiSearchMultiSearchRequest = {
    query: string;
    messages?: never;
    ai_search_options: AiSearchMultiSearchOptions;
} | {
    query?: never;
    messages: AiSearchMessage[];
    ai_search_options: AiSearchMultiSearchOptions;
};
type AiSearchMultiSearchChunk = AiSearchSearchResponse['chunks'][number] & {
    instance_id: string;
};
type AiSearchMultiSearchError = {
    instance_id: string;
    message: string;
};
type AiSearchMultiSearchResponse = {
    search_query: string;
    chunks: AiSearchMultiSearchChunk[];
    errors?: AiSearchMultiSearchError[];
};
type AiSearchMultiChatCompletionsRequest = Omit<AiSearchChatCompletionsRequest, 'ai_search_options'> & {
    ai_search_options: AiSearchMultiSearchOptions;
};
type AiSearchMultiChatCompletionsResponse = Omit<AiSearchChatCompletionsResponse, 'chunks'> & {
    chunks: AiSearchMultiSearchChunk[];
    errors?: AiSearchMultiSearchError[];
};
type AiSearchSearchResponse = {
    search_query: string;
    chunks: Array<{
        id: string;
        type: string;
        score: number;
        text: string;
        item: {
            timestamp?: number;
            key: string;
            metadata?: Record<string, unknown>;
        };
        scoring_details?: {
            keyword_score?: number;
            vector_score?: number;
            keyword_rank?: number;
            vector_rank?: number;
            reranking_score?: number;
            fusion_method?: 'rrf' | 'max';
            [key: string]: unknown;
        };
    }>;
};
type AiSearchChatCompletionsResponse = {
    id?: string;
    object?: string;
    model?: string;
    choices: Array<{
        index?: number;
        message: {
            role: 'system' | 'developer' | 'user' | 'assistant' | 'tool';
            content: string | null;
            [key: string]: unknown;
        };
        [key: string]: unknown;
    }>;
    chunks: AiSearchSearchResponse['chunks'];
    [key: string]: unknown;
};
type AiSearchStatsResponse = {
    queued?: number;
    running?: number;
    completed?: number;
    error?: number;
    skipped?: number;
    outdated?: number;
    last_activity?: string;
    engine?: {
        vectorize?: {
            vectorsCount: number;
            dimensions: number;
        };
        r2?: {
            payloadSizeBytes: number;
            metadataSizeBytes: number;
            objectCount: number;
        };
    };
};
type AiSearchInstanceInfo = {
    id: string;
    type?: 'r2' | 'web-crawler' | string;
    source?: string;
    source_params?: unknown;
    paused?: boolean;
    status?: string;
    namespace?: string;
    created_at?: string;
    modified_at?: string;
    token_id?: string;
    ai_gateway_id?: string;
    rewrite_query?: boolean;
    reranking?: boolean;
    embedding_model?: string;
    ai_search_model?: string;
    rewrite_model?: string;
    reranking_model?: string;
    hybrid_search_enabled?: boolean;
    index_method?: {
        vector?: boolean;
        keyword?: boolean;
    };
    fusion_method?: 'max' | 'rrf';
    indexing_options?: {
        keyword_tokenizer?: 'porter' | 'trigram';
    } | null;
    retrieval_options?: {
        keyword_match_mode?: 'and' | 'or';
        boost_by?: Array<{
            field: string;
            direction?: 'asc' | 'desc' | 'exists' | 'not_exists';
        }>;
    } | null;
    chunk?: boolean;
    chunk_size?: number;
    chunk_overlap?: number;
    score_threshold?: number;
    max_num_results?: number;
    cache?: boolean;
    cache_threshold?: 'super_strict_match' | 'close_enough' | 'flexible_friend' | 'anything_goes';
    custom_metadata?: Array<{
        field_name: string;
        data_type: 'text' | 'number' | 'boolean' | 'datetime';
    }>;
    sync_interval?: 3600 | 7200 | 14400 | 21600 | 43200 | 86400;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
};
type AiSearchListInstancesParams = {
    page?: number;
    per_page?: number;
    search?: string;
    order_by?: 'created_at';
    order_by_direction?: 'asc' | 'desc';
};
type AiSearchListResponse = {
    result: AiSearchInstanceInfo[];
    result_info?: {
        count: number;
        page: number;
        per_page: number;
        total_count: number;
    };
};
type AiSearchConfig = {
    id: string;
    type?: 'r2' | 'web-crawler' | string;
    source?: string;
    source_params?: unknown;
    token_id?: string;
    ai_gateway_id?: string;
    rewrite_query?: boolean;
    reranking?: boolean;
    embedding_model?: string;
    ai_search_model?: string;
    rewrite_model?: string;
    reranking_model?: string;
    hybrid_search_enabled?: boolean;
    index_method?: {
        vector?: boolean;
        keyword?: boolean;
    };
    fusion_method?: 'max' | 'rrf';
    indexing_options?: {
        keyword_tokenizer?: 'porter' | 'trigram';
    } | null;
    retrieval_options?: {
        keyword_match_mode?: 'and' | 'or';
        boost_by?: Array<{
            field: string;
            direction?: 'asc' | 'desc' | 'exists' | 'not_exists';
        }>;
    } | null;
    chunk?: boolean;
    chunk_size?: number;
    chunk_overlap?: number;
    score_threshold?: number;
    max_num_results?: number;
    cache?: boolean;
    cache_threshold?: 'super_strict_match' | 'close_enough' | 'flexible_friend' | 'anything_goes';
    custom_metadata?: Array<{
        field_name: string;
        data_type: 'text' | 'number' | 'boolean' | 'datetime';
    }>;
    namespace?: string;
    sync_interval?: 3600 | 7200 | 14400 | 21600 | 43200 | 86400;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
};
type AiSearchItemInfo = {
    id: string;
    key: string;
    status: 'completed' | 'error' | 'skipped' | 'queued' | 'running' | 'outdated';
    next_action?: 'INDEX' | 'DELETE' | null;
    error?: string;
    checksum?: string;
    namespace?: string;
    chunks_count?: number | null;
    file_size?: number | null;
    source_id?: string | null;
    last_seen_at?: string;
    created_at?: string;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
};
type AiSearchItemContentResult = {
    body: ReadableStream;
    contentType: string;
    filename: string;
    size: number;
};
type AiSearchUploadItemOptions = {
    metadata?: Record<string, unknown>;
};
type AiSearchListItemsParams = {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: 'status' | 'modified_at';
    status?: 'queued' | 'running' | 'completed' | 'error' | 'skipped' | 'outdated';
    source?: string;
    metadata_filter?: string;
};
type AiSearchListItemsResponse = {
    result: AiSearchItemInfo[];
    result_info?: {
        count: number;
        page: number;
        per_page: number;
        total_count: number;
    };
};
type AiSearchItemLogsParams = {
    limit?: number;
    cursor?: string;
};
type AiSearchItemLog = {
    timestamp: string;
    action: string;
    message: string;
    fileKey?: string;
    chunkCount?: number;
    processingTimeMs?: number;
    errorType?: string;
};
type AiSearchItemLogsResponse = {
    result: AiSearchItemLog[];
    result_info: {
        count: number;
        per_page: number;
        cursor: string | null;
        truncated: boolean;
    };
};
type AiSearchItemChunksParams = {
    limit?: number;
    offset?: number;
};
type AiSearchItemChunk = {
    id: string;
    text: string;
    start_byte: number;
    end_byte: number;
    item?: {
        timestamp?: number;
        key: string;
        metadata?: Record<string, unknown>;
    };
};
type AiSearchItemChunksResponse = {
    result: AiSearchItemChunk[];
    result_info: {
        count: number;
        total: number;
        limit: number;
        offset: number;
    };
};
type AiSearchJobInfo = {
    id: string;
    source: 'user' | 'schedule';
    description?: string;
    last_seen_at?: string;
    started_at?: string;
    ended_at?: string;
    end_reason?: string;
};
type AiSearchJobLog = {
    id: number;
    message: string;
    message_type: number;
    created_at: number;
};
type AiSearchCreateJobParams = {
    description?: string;
};
type AiSearchListJobsParams = {
    page?: number;
    per_page?: number;
};
type AiSearchListJobsResponse = {
    result: AiSearchJobInfo[];
    result_info?: {
        count: number;
        page: number;
        per_page: number;
        total_count: number;
    };
};
type AiSearchJobLogsParams = {
    page?: number;
    per_page?: number;
};
type AiSearchJobLogsResponse = {
    result: AiSearchJobLog[];
    result_info?: {
        count: number;
        page: number;
        per_page: number;
        total_count: number;
    };
};
declare abstract class AiSearchItem {
    info(): Promise<AiSearchItemInfo>;
    download(): Promise<AiSearchItemContentResult>;
    sync(): Promise<AiSearchItemInfo>;
    logs(params?: AiSearchItemLogsParams): Promise<AiSearchItemLogsResponse>;
    chunks(params?: AiSearchItemChunksParams): Promise<AiSearchItemChunksResponse>;
}
declare abstract class AiSearchItems {
    list(params?: AiSearchListItemsParams): Promise<AiSearchListItemsResponse>;
    upload(name: string, content: ReadableStream | Blob | string, options?: AiSearchUploadItemOptions): Promise<AiSearchItemInfo>;
    uploadAndPoll(name: string, content: ReadableStream | Blob | string, options?: AiSearchUploadItemOptions & {
        pollIntervalMs?: number;
        timeoutMs?: number;
    }): Promise<AiSearchItemInfo>;
    get(itemId: string): AiSearchItem;
    delete(itemId: string): Promise<void>;
}
declare abstract class AiSearchJob {
    info(): Promise<AiSearchJobInfo>;
    logs(params?: AiSearchJobLogsParams): Promise<AiSearchJobLogsResponse>;
    cancel(): Promise<AiSearchJobInfo>;
}
declare abstract class AiSearchJobs {
    list(params?: AiSearchListJobsParams): Promise<AiSearchListJobsResponse>;
    create(params?: AiSearchCreateJobParams): Promise<AiSearchJobInfo>;
    get(jobId: string): AiSearchJob;
}
declare abstract class AiSearchInstance {
    search(params: AiSearchSearchRequest): Promise<AiSearchSearchResponse>;
    chatCompletions(params: AiSearchChatCompletionsRequest & {
        stream: true;
    }): Promise<ReadableStream>;
    chatCompletions(params: AiSearchChatCompletionsRequest): Promise<AiSearchChatCompletionsResponse>;
    update(config: Partial<AiSearchConfig>): Promise<AiSearchInstanceInfo>;
    info(): Promise<AiSearchInstanceInfo>;
    stats(): Promise<AiSearchStatsResponse>;
    get items(): AiSearchItems;
    get jobs(): AiSearchJobs;
}
declare abstract class AiSearchNamespace {
    get(name: string): AiSearchInstance;
    list(params?: AiSearchListInstancesParams): Promise<AiSearchListResponse>;
    create(config: AiSearchConfig): Promise<AiSearchInstance>;
    delete(name: string): Promise<void>;
    search(params: AiSearchMultiSearchRequest): Promise<AiSearchMultiSearchResponse>;
    chatCompletions(params: AiSearchMultiChatCompletionsRequest & {
        stream: true;
    }): Promise<ReadableStream>;
    chatCompletions(params: AiSearchMultiChatCompletionsRequest): Promise<AiSearchMultiChatCompletionsResponse>;
}
type AiImageClassificationInput = {
    image: number[];
};
type AiImageClassificationOutput = {
    score?: number;
    label?: string;
}[];
declare abstract class BaseAiImageClassification {
    inputs: AiImageClassificationInput;
    postProcessedOutputs: AiImageClassificationOutput;
}
type AiImageToTextInput = {
    image: number[];
    prompt?: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    raw?: boolean;
    messages?: RoleScopedChatInput[];
};
type AiImageToTextOutput = {
    description: string;
};
declare abstract class BaseAiImageToText {
    inputs: AiImageToTextInput;
    postProcessedOutputs: AiImageToTextOutput;
}
type AiImageTextToTextInput = {
    image: string;
    prompt?: string;
    max_tokens?: number;
    temperature?: number;
    ignore_eos?: boolean;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    raw?: boolean;
    messages?: RoleScopedChatInput[];
};
type AiImageTextToTextOutput = {
    description: string;
};
declare abstract class BaseAiImageTextToText {
    inputs: AiImageTextToTextInput;
    postProcessedOutputs: AiImageTextToTextOutput;
}
type AiMultimodalEmbeddingsInput = {
    image: string;
    text: string[];
};
type AiIMultimodalEmbeddingsOutput = {
    data: number[][];
    shape: number[];
};
declare abstract class BaseAiMultimodalEmbeddings {
    inputs: AiImageTextToTextInput;
    postProcessedOutputs: AiImageTextToTextOutput;
}
type AiObjectDetectionInput = {
    image: number[];
};
type AiObjectDetectionOutput = {
    score?: number;
    label?: string;
}[];
declare abstract class BaseAiObjectDetection {
    inputs: AiObjectDetectionInput;
    postProcessedOutputs: AiObjectDetectionOutput;
}
type AiSentenceSimilarityInput = {
    source: string;
    sentences: string[];
};
type AiSentenceSimilarityOutput = number[];
declare abstract class BaseAiSentenceSimilarity {
    inputs: AiSentenceSimilarityInput;
    postProcessedOutputs: AiSentenceSimilarityOutput;
}
type AiAutomaticSpeechRecognitionInput = {
    audio: number[];
};
type AiAutomaticSpeechRecognitionOutput = {
    text?: string;
    words?: {
        word: string;
        start: number;
        end: number;
    }[];
    vtt?: string;
};
declare abstract class BaseAiAutomaticSpeechRecognition {
    inputs: AiAutomaticSpeechRecognitionInput;
    postProcessedOutputs: AiAutomaticSpeechRecognitionOutput;
}
type AiSummarizationInput = {
    input_text: string;
    max_length?: number;
};
type AiSummarizationOutput = {
    summary: string;
};
declare abstract class BaseAiSummarization {
    inputs: AiSummarizationInput;
    postProcessedOutputs: AiSummarizationOutput;
}
type AiTextClassificationInput = {
    text: string;
};
type AiTextClassificationOutput = {
    score?: number;
    label?: string;
}[];
declare abstract class BaseAiTextClassification {
    inputs: AiTextClassificationInput;
    postProcessedOutputs: AiTextClassificationOutput;
}
type AiTextEmbeddingsInput = {
    text: string | string[];
};
type AiTextEmbeddingsOutput = {
    shape: number[];
    data: number[][];
};
declare abstract class BaseAiTextEmbeddings {
    inputs: AiTextEmbeddingsInput;
    postProcessedOutputs: AiTextEmbeddingsOutput;
}
type RoleScopedChatInput = {
    role: "user" | "assistant" | "system" | "tool" | (string & NonNullable<unknown>);
    content: string;
    name?: string;
};
type AiTextGenerationToolLegacyInput = {
    name: string;
    description: string;
    parameters?: {
        type: "object" | (string & NonNullable<unknown>);
        properties: {
            [key: string]: {
                type: string;
                description?: string;
            };
        };
        required: string[];
    };
};
type AiTextGenerationToolInput = {
    type: "function" | (string & NonNullable<unknown>);
    function: {
        name: string;
        description: string;
        parameters?: {
            type: "object" | (string & NonNullable<unknown>);
            properties: {
                [key: string]: {
                    type: string;
                    description?: string;
                };
            };
            required: string[];
        };
    };
};
type AiTextGenerationFunctionsInput = {
    name: string;
    code: string;
};
type AiTextGenerationResponseFormat = {
    type: string;
    json_schema?: any;
};
type AiTextGenerationInput = {
    prompt?: string;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    messages?: RoleScopedChatInput[];
    response_format?: AiTextGenerationResponseFormat;
    tools?: AiTextGenerationToolInput[] | AiTextGenerationToolLegacyInput[] | (object & NonNullable<unknown>);
    functions?: AiTextGenerationFunctionsInput[];
};
type AiTextGenerationToolLegacyOutput = {
    name: string;
    arguments: unknown;
};
type AiTextGenerationToolOutput = {
    id: string;
    type: "function";
    function: {
        name: string;
        arguments: string;
    };
};
type UsageTags = {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
};
type AiTextGenerationOutput = {
    response?: string;
    tool_calls?: AiTextGenerationToolLegacyOutput[] & AiTextGenerationToolOutput[];
    usage?: UsageTags;
};
declare abstract class BaseAiTextGeneration {
    inputs: AiTextGenerationInput;
    postProcessedOutputs: AiTextGenerationOutput;
}
type AiTextToSpeechInput = {
    prompt: string;
    lang?: string;
};
type AiTextToSpeechOutput = Uint8Array | {
    audio: string;
};
declare abstract class BaseAiTextToSpeech {
    inputs: AiTextToSpeechInput;
    postProcessedOutputs: AiTextToSpeechOutput;
}
type AiTextToImageInput = {
    prompt: string;
    negative_prompt?: string;
    height?: number;
    width?: number;
    image?: number[];
    image_b64?: string;
    mask?: number[];
    num_steps?: number;
    strength?: number;
    guidance?: number;
    seed?: number;
};
type AiTextToImageOutput = ReadableStream<Uint8Array>;
declare abstract class BaseAiTextToImage {
    inputs: AiTextToImageInput;
    postProcessedOutputs: AiTextToImageOutput;
}
type AiTranslationInput = {
    text: string;
    target_lang: string;
    source_lang?: string;
};
type AiTranslationOutput = {
    translated_text?: string;
};
declare abstract class BaseAiTranslation {
    inputs: AiTranslationInput;
    postProcessedOutputs: AiTranslationOutput;
}
type ChatCompletionContentPartText = {
    type: "text";
    text: string;
};
type ChatCompletionContentPartImage = {
    type: "image_url";
    image_url: {
        url: string;
        detail?: "auto" | "low" | "high";
    };
};
type ChatCompletionContentPartInputAudio = {
    type: "input_audio";
    input_audio: {
        data: string;
        format: "wav" | "mp3";
    };
};
type ChatCompletionContentPartFile = {
    type: "file";
    file: {
        file_data?: string;
        file_id?: string;
        filename?: string;
    };
};
type ChatCompletionContentPartRefusal = {
    type: "refusal";
    refusal: string;
};
type ChatCompletionContentPart = ChatCompletionContentPartText | ChatCompletionContentPartImage | ChatCompletionContentPartInputAudio | ChatCompletionContentPartFile;
type FunctionDefinition = {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
    strict?: boolean | null;
};
type ChatCompletionFunctionTool = {
    type: "function";
    function: FunctionDefinition;
};
type ChatCompletionCustomToolGrammarFormat = {
    type: "grammar";
    grammar: {
        definition: string;
        syntax: "lark" | "regex";
    };
};
type ChatCompletionCustomToolTextFormat = {
    type: "text";
};
type ChatCompletionCustomToolFormat = ChatCompletionCustomToolTextFormat | ChatCompletionCustomToolGrammarFormat;
type ChatCompletionCustomTool = {
    type: "custom";
    custom: {
        name: string;
        description?: string;
        format?: ChatCompletionCustomToolFormat;
    };
};
type ChatCompletionTool = ChatCompletionFunctionTool | ChatCompletionCustomTool;
type ChatCompletionMessageFunctionToolCall = {
    id: string;
    type: "function";
    function: {
        name: string;
        arguments: string;
    };
};
type ChatCompletionMessageCustomToolCall = {
    id: string;
    type: "custom";
    custom: {
        name: string;
        input: string;
    };
};
type ChatCompletionMessageToolCall = ChatCompletionMessageFunctionToolCall | ChatCompletionMessageCustomToolCall;
type ChatCompletionToolChoiceFunction = {
    type: "function";
    function: {
        name: string;
    };
};
type ChatCompletionToolChoiceCustom = {
    type: "custom";
    custom: {
        name: string;
    };
};
type ChatCompletionToolChoiceAllowedTools = {
    type: "allowed_tools";
    allowed_tools: {
        mode: "auto" | "required";
        tools: Array<Record<string, unknown>>;
    };
};
type ChatCompletionToolChoiceOption = "none" | "auto" | "required" | ChatCompletionToolChoiceFunction | ChatCompletionToolChoiceCustom | ChatCompletionToolChoiceAllowedTools;
type DeveloperMessage = {
    role: "developer";
    content: string | Array<{
        type: "text";
        text: string;
    }>;
    name?: string;
};
type SystemMessage = {
    role: "system";
    content: string | Array<{
        type: "text";
        text: string;
    }>;
    name?: string;
};
type UserMessageContentPart = {
    type: "text" | "image_url" | "input_audio" | "file";
    text?: string;
    image_url?: {
        url?: string;
        detail?: "auto" | "low" | "high";
    };
    input_audio?: {
        data?: string;
        format?: "wav" | "mp3";
    };
    file?: {
        file_data?: string;
        file_id?: string;
        filename?: string;
    };
};
type UserMessage = {
    role: "user";
    content: string | Array<UserMessageContentPart>;
    name?: string;
};
type AssistantMessageContentPart = {
    type: "text" | "refusal";
    text?: string;
    refusal?: string;
};
type AssistantMessage = {
    role: "assistant";
    content?: string | null | Array<AssistantMessageContentPart>;
    refusal?: string | null;
    name?: string;
    audio?: {
        id: string;
    };
    tool_calls?: Array<ChatCompletionMessageToolCall>;
    function_call?: {
        name: string;
        arguments: string;
    };
};
type ToolMessage = {
    role: "tool";
    content: string | Array<{
        type: "text";
        text: string;
    }>;
    tool_call_id: string;
};
type FunctionMessage = {
    role: "function";
    content: string;
    name: string;
};
type ChatCompletionMessageParam = DeveloperMessage | SystemMessage | UserMessage | AssistantMessage | ToolMessage | FunctionMessage;
type ChatCompletionsResponseFormatText = {
    type: "text";
};
type ChatCompletionsResponseFormatJSONObject = {
    type: "json_object";
};
type ResponseFormatJSONSchema = {
    type: "json_schema";
    json_schema: {
        name: string;
        description?: string;
        schema?: Record<string, unknown>;
        strict?: boolean | null;
    };
};
type ResponseFormat = ChatCompletionsResponseFormatText | ChatCompletionsResponseFormatJSONObject | ResponseFormatJSONSchema;
type ChatCompletionsStreamOptions = {
    include_usage?: boolean;
    include_obfuscation?: boolean;
};
type PredictionContent = {
    type: "content";
    content: string | Array<{
        type: "text";
        text: string;
    }>;
};
type AudioParams = {
    voice: string | {
        id: string;
    };
    format: "wav" | "aac" | "mp3" | "flac" | "opus" | "pcm16";
};
type WebSearchUserLocation = {
    type: "approximate";
    approximate: {
        city?: string;
        country?: string;
        region?: string;
        timezone?: string;
    };
};
type WebSearchOptions = {
    search_context_size?: "low" | "medium" | "high";
    user_location?: WebSearchUserLocation;
};
type ChatTemplateKwargs = {
    enable_thinking?: boolean;
    clear_thinking?: boolean;
};
type ChatCompletionsCommonOptions = {
    model?: string;
    audio?: AudioParams;
    frequency_penalty?: number | null;
    logit_bias?: Record<string, unknown> | null;
    logprobs?: boolean | null;
    top_logprobs?: number | null;
    max_tokens?: number | null;
    max_completion_tokens?: number | null;
    metadata?: Record<string, unknown> | null;
    modalities?: Array<"text" | "audio"> | null;
    n?: number | null;
    parallel_tool_calls?: boolean;
    prediction?: PredictionContent;
    presence_penalty?: number | null;
    reasoning_effort?: "low" | "medium" | "high" | null;
    chat_template_kwargs?: ChatTemplateKwargs;
    response_format?: ResponseFormat;
    seed?: number | null;
    service_tier?: "auto" | "default" | "flex" | "scale" | "priority" | null;
    stop?: string | Array<string> | null;
    store?: boolean | null;
    stream?: boolean | null;
    stream_options?: ChatCompletionsStreamOptions;
    temperature?: number | null;
    tool_choice?: ChatCompletionToolChoiceOption;
    tools?: Array<ChatCompletionTool>;
    top_p?: number | null;
    user?: string;
    web_search_options?: WebSearchOptions;
    function_call?: "none" | "auto" | {
        name: string;
    };
    functions?: Array<FunctionDefinition>;
};
type PromptTokensDetails = {
    cached_tokens?: number;
    audio_tokens?: number;
};
type CompletionTokensDetails = {
    reasoning_tokens?: number;
    audio_tokens?: number;
    accepted_prediction_tokens?: number;
    rejected_prediction_tokens?: number;
};
type CompletionUsage = {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details?: PromptTokensDetails;
    completion_tokens_details?: CompletionTokensDetails;
};
type ChatCompletionTopLogprob = {
    token: string;
    logprob: number;
    bytes: Array<number> | null;
};
type ChatCompletionTokenLogprob = {
    token: string;
    logprob: number;
    bytes: Array<number> | null;
    top_logprobs: Array<ChatCompletionTopLogprob>;
};
type ChatCompletionAudio = {
    id: string;
    data: string;
    expires_at: number;
    transcript: string;
};
type ChatCompletionUrlCitation = {
    type: "url_citation";
    url_citation: {
        url: string;
        title: string;
        start_index: number;
        end_index: number;
    };
};
type ChatCompletionResponseMessage = {
    role: "assistant";
    content: string | null;
    refusal: string | null;
    annotations?: Array<ChatCompletionUrlCitation>;
    audio?: ChatCompletionAudio;
    tool_calls?: Array<ChatCompletionMessageToolCall>;
    function_call?: {
        name: string;
        arguments: string;
    } | null;
};
type ChatCompletionLogprobs = {
    content: Array<ChatCompletionTokenLogprob> | null;
    refusal?: Array<ChatCompletionTokenLogprob> | null;
};
type ChatCompletionChoice = {
    index: number;
    message: ChatCompletionResponseMessage;
    finish_reason: "stop" | "length" | "tool_calls" | "content_filter" | "function_call";
    logprobs: ChatCompletionLogprobs | null;
};
type ChatCompletionsMessagesInput = {
    messages: Array<ChatCompletionMessageParam>;
} & ChatCompletionsCommonOptions;
type ChatCompletionsOutput = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<ChatCompletionChoice>;
    usage?: CompletionUsage;
    system_fingerprint?: string | null;
    service_tier?: "auto" | "default" | "flex" | "scale" | "priority" | null;
};
type ResponsesInput = {
    background?: boolean | null;
    conversation?: string | ResponseConversationParam | null;
    include?: Array<ResponseIncludable> | null;
    input?: string | ResponseInput;
    instructions?: string | null;
    max_output_tokens?: number | null;
    parallel_tool_calls?: boolean | null;
    previous_response_id?: string | null;
    prompt_cache_key?: string;
    reasoning?: Reasoning | null;
    safety_identifier?: string;
    service_tier?: "auto" | "default" | "flex" | "scale" | "priority" | null;
    stream?: boolean | null;
    stream_options?: StreamOptions | null;
    temperature?: number | null;
    text?: ResponseTextConfig;
    tool_choice?: ToolChoiceOptions | ToolChoiceFunction;
    tools?: Array<Tool>;
    top_p?: number | null;
    truncation?: "auto" | "disabled" | null;
};
type ResponsesOutput = {
    id?: string;
    created_at?: number;
    output_text?: string;
    error?: ResponseError | null;
    incomplete_details?: ResponseIncompleteDetails | null;
    instructions?: string | Array<ResponseInputItem> | null;
    object?: "response";
    output?: Array<ResponseOutputItem>;
    parallel_tool_calls?: boolean;
    temperature?: number | null;
    tool_choice?: ToolChoiceOptions | ToolChoiceFunction;
    tools?: Array<Tool>;
    top_p?: number | null;
    max_output_tokens?: number | null;
    previous_response_id?: string | null;
    prompt?: ResponsePrompt | null;
    reasoning?: Reasoning | null;
    safety_identifier?: string;
    service_tier?: "auto" | "default" | "flex" | "scale" | "priority" | null;
    status?: ResponseStatus;
    text?: ResponseTextConfig;
    truncation?: "auto" | "disabled" | null;
    usage?: ResponseUsage;
};
type EasyInputMessage = {
    content: string | ResponseInputMessageContentList;
    role: "user" | "assistant" | "system" | "developer";
    type?: "message";
};
type ResponsesFunctionTool = {
    name: string;
    parameters: {
        [key: string]: unknown;
    } | null;
    strict: boolean | null;
    type: "function";
    description?: string | null;
};
type ResponseIncompleteDetails = {
    reason?: "max_output_tokens" | "content_filter";
};
type ResponsePrompt = {
    id: string;
    variables?: {
        [key: string]: string | ResponseInputText | ResponseInputImage;
    } | null;
    version?: string | null;
};
type Reasoning = {
    effort?: ReasoningEffort | null;
    generate_summary?: "auto" | "concise" | "detailed" | null;
    summary?: "auto" | "concise" | "detailed" | null;
};
type ResponseContent = ResponseInputText | ResponseInputImage | ResponseOutputText | ResponseOutputRefusal | ResponseContentReasoningText;
type ResponseContentReasoningText = {
    text: string;
    type: "reasoning_text";
};
type ResponseConversationParam = {
    id: string;
};
type ResponseCreatedEvent = {
    response: Response;
    sequence_number: number;
    type: "response.created";
};
type ResponseCustomToolCallOutput = {
    call_id: string;
    output: string | Array<ResponseInputText | ResponseInputImage>;
    type: "custom_tool_call_output";
    id?: string;
};
type ResponseError = {
    code: "server_error" | "rate_limit_exceeded" | "invalid_prompt" | "vector_store_timeout" | "invalid_image" | "invalid_image_format" | "invalid_base64_image" | "invalid_image_url" | "image_too_large" | "image_too_small" | "image_parse_error" | "image_content_policy_violation" | "invalid_image_mode" | "image_file_too_large" | "unsupported_image_media_type" | "empty_image_file" | "failed_to_download_image" | "image_file_not_found";
    message: string;
};
type ResponseErrorEvent = {
    code: string | null;
    message: string;
    param: string | null;
    sequence_number: number;
    type: "error";
};
type ResponseFailedEvent = {
    response: Response;
    sequence_number: number;
    type: "response.failed";
};
type ResponseFormatText = {
    type: "text";
};
type ResponseFormatJSONObject = {
    type: "json_object";
};
type ResponseFormatTextConfig = ResponseFormatText | ResponseFormatTextJSONSchemaConfig | ResponseFormatJSONObject;
type ResponseFormatTextJSONSchemaConfig = {
    name: string;
    schema: {
        [key: string]: unknown;
    };
    type: "json_schema";
    description?: string;
    strict?: boolean | null;
};
type ResponseFunctionCallArgumentsDeltaEvent = {
    delta: string;
    item_id: string;
    output_index: number;
    sequence_number: number;
    type: "response.function_call_arguments.delta";
};
type ResponseFunctionCallArgumentsDoneEvent = {
    arguments: string;
    item_id: string;
    name: string;
    output_index: number;
    sequence_number: number;
    type: "response.function_call_arguments.done";
};
type ResponseFunctionCallOutputItem = ResponseInputTextContent | ResponseInputImageContent;
type ResponseFunctionCallOutputItemList = Array<ResponseFunctionCallOutputItem>;
type ResponseFunctionToolCall = {
    arguments: string;
    call_id: string;
    name: string;
    type: "function_call";
    id?: string;
    status?: "in_progress" | "completed" | "incomplete";
};
interface ResponseFunctionToolCallItem extends ResponseFunctionToolCall {
    id: string;
}
type ResponseFunctionToolCallOutputItem = {
    id: string;
    call_id: string;
    output: string | Array<ResponseInputText | ResponseInputImage>;
    type: "function_call_output";
    status?: "in_progress" | "completed" | "incomplete";
};
type ResponseIncludable = "message.input_image.image_url" | "message.output_text.logprobs";
type ResponseIncompleteEvent = {
    response: Response;
    sequence_number: number;
    type: "response.incomplete";
};
type ResponseInput = Array<ResponseInputItem>;
type ResponseInputContent = ResponseInputText | ResponseInputImage;
type ResponseInputImage = {
    detail: "low" | "high" | "auto";
    type: "input_image";
    image_url?: string | null;
};
type ResponseInputImageContent = {
    type: "input_image";
    detail?: "low" | "high" | "auto" | null;
    image_url?: string | null;
};
type ResponseInputItem = EasyInputMessage | ResponseInputItemMessage | ResponseOutputMessage | ResponseFunctionToolCall | ResponseInputItemFunctionCallOutput | ResponseReasoningItem;
type ResponseInputItemFunctionCallOutput = {
    call_id: string;
    output: string | ResponseFunctionCallOutputItemList;
    type: "function_call_output";
    id?: string | null;
    status?: "in_progress" | "completed" | "incomplete" | null;
};
type ResponseInputItemMessage = {
    content: ResponseInputMessageContentList;
    role: "user" | "system" | "developer";
    status?: "in_progress" | "completed" | "incomplete";
    type?: "message";
};
type ResponseInputMessageContentList = Array<ResponseInputContent>;
type ResponseInputMessageItem = {
    id: string;
    content: ResponseInputMessageContentList;
    role: "user" | "system" | "developer";
    status?: "in_progress" | "completed" | "incomplete";
    type?: "message";
};
type ResponseInputText = {
    text: string;
    type: "input_text";
};
type ResponseInputTextContent = {
    text: string;
    type: "input_text";
};
type ResponseItem = ResponseInputMessageItem | ResponseOutputMessage | ResponseFunctionToolCallItem | ResponseFunctionToolCallOutputItem;
type ResponseOutputItem = ResponseOutputMessage | ResponseFunctionToolCall | ResponseReasoningItem;
type ResponseOutputItemAddedEvent = {
    item: ResponseOutputItem;
    output_index: number;
    sequence_number: number;
    type: "response.output_item.added";
};
type ResponseOutputItemDoneEvent = {
    item: ResponseOutputItem;
    output_index: number;
    sequence_number: number;
    type: "response.output_item.done";
};
type ResponseOutputMessage = {
    id: string;
    content: Array<ResponseOutputText | ResponseOutputRefusal>;
    role: "assistant";
    status: "in_progress" | "completed" | "incomplete";
    type: "message";
};
type ResponseOutputRefusal = {
    refusal: string;
    type: "refusal";
};
type ResponseOutputText = {
    text: string;
    type: "output_text";
    logprobs?: Array<Logprob>;
};
type ResponseReasoningItem = {
    id: string;
    summary: Array<ResponseReasoningSummaryItem>;
    type: "reasoning";
    content?: Array<ResponseReasoningContentItem>;
    encrypted_content?: string | null;
    status?: "in_progress" | "completed" | "incomplete";
};
type ResponseReasoningSummaryItem = {
    text: string;
    type: "summary_text";
};
type ResponseReasoningContentItem = {
    text: string;
    type: "reasoning_text";
};
type ResponseReasoningTextDeltaEvent = {
    content_index: number;
    delta: string;
    item_id: string;
    output_index: number;
    sequence_number: number;
    type: "response.reasoning_text.delta";
};
type ResponseReasoningTextDoneEvent = {
    content_index: number;
    item_id: string;
    output_index: number;
    sequence_number: number;
    text: string;
    type: "response.reasoning_text.done";
};
type ResponseRefusalDeltaEvent = {
    content_index: number;
    delta: string;
    item_id: string;
    output_index: number;
    sequence_number: number;
    type: "response.refusal.delta";
};
type ResponseRefusalDoneEvent = {
    content_index: number;
    item_id: string;
    output_index: number;
    refusal: string;
    sequence_number: number;
    type: "response.refusal.done";
};
type ResponseStatus = "completed" | "failed" | "in_progress" | "cancelled" | "queued" | "incomplete";
type ResponseStreamEvent = ResponseCompletedEvent | ResponseCreatedEvent | ResponseErrorEvent | ResponseFunctionCallArgumentsDeltaEvent | ResponseFunctionCallArgumentsDoneEvent | ResponseFailedEvent | ResponseIncompleteEvent | ResponseOutputItemAddedEvent | ResponseOutputItemDoneEvent | ResponseReasoningTextDeltaEvent | ResponseReasoningTextDoneEvent | ResponseRefusalDeltaEvent | ResponseRefusalDoneEvent | ResponseTextDeltaEvent | ResponseTextDoneEvent;
type ResponseCompletedEvent = {
    response: Response;
    sequence_number: number;
    type: "response.completed";
};
type ResponseTextConfig = {
    format?: ResponseFormatTextConfig;
    verbosity?: "low" | "medium" | "high" | null;
};
type ResponseTextDeltaEvent = {
    content_index: number;
    delta: string;
    item_id: string;
    logprobs: Array<Logprob>;
    output_index: number;
    sequence_number: number;
    type: "response.output_text.delta";
};
type ResponseTextDoneEvent = {
    content_index: number;
    item_id: string;
    logprobs: Array<Logprob>;
    output_index: number;
    sequence_number: number;
    text: string;
    type: "response.output_text.done";
};
type Logprob = {
    token: string;
    logprob: number;
    top_logprobs?: Array<TopLogprob>;
};
type TopLogprob = {
    token?: string;
    logprob?: number;
};
type ResponseUsage = {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
};
type Tool = ResponsesFunctionTool;
type ToolChoiceFunction = {
    name: string;
    type: "function";
};
type ToolChoiceOptions = "none";
type ReasoningEffort = "minimal" | "low" | "medium" | "high" | null;
type StreamOptions = {
    include_obfuscation?: boolean;
};
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
type XOR<T, U> = (T & Without<U, T>) | (U & Without<T, U>);
type Ai_Cf_Baai_Bge_Base_En_V1_5_Input = {
    text: string | string[];
    pooling?: "mean" | "cls";
} | {
    requests: {
        text: string | string[];
        pooling?: "mean" | "cls";
    }[];
};
type Ai_Cf_Baai_Bge_Base_En_V1_5_Output = {
    shape?: number[];
    data?: number[][];
    pooling?: "mean" | "cls";
} | Ai_Cf_Baai_Bge_Base_En_V1_5_AsyncResponse;
interface Ai_Cf_Baai_Bge_Base_En_V1_5_AsyncResponse {
    request_id?: string;
}
declare abstract class Base_Ai_Cf_Baai_Bge_Base_En_V1_5 {
    inputs: Ai_Cf_Baai_Bge_Base_En_V1_5_Input;
    postProcessedOutputs: Ai_Cf_Baai_Bge_Base_En_V1_5_Output;
}
type Ai_Cf_Openai_Whisper_Input = string | {
    audio: number[];
};
interface Ai_Cf_Openai_Whisper_Output {
    text: string;
    word_count?: number;
    words?: {
        word?: string;
        start?: number;
        end?: number;
    }[];
    vtt?: string;
}
declare abstract class Base_Ai_Cf_Openai_Whisper {
    inputs: Ai_Cf_Openai_Whisper_Input;
    postProcessedOutputs: Ai_Cf_Openai_Whisper_Output;
}
type Ai_Cf_Meta_M2M100_1_2B_Input = {
    text: string;
    source_lang?: string;
    target_lang: string;
} | {
    requests: {
        text: string;
        source_lang?: string;
        target_lang: string;
    }[];
};
type Ai_Cf_Meta_M2M100_1_2B_Output = {
    translated_text?: string;
} | Ai_Cf_Meta_M2M100_1_2B_AsyncResponse;
interface Ai_Cf_Meta_M2M100_1_2B_AsyncResponse {
    request_id?: string;
}
declare abstract class Base_Ai_Cf_Meta_M2M100_1_2B {
    inputs: Ai_Cf_Meta_M2M100_1_2B_Input;
    postProcessedOutputs: Ai_Cf_Meta_M2M100_1_2B_Output;
}
type Ai_Cf_Baai_Bge_Small_En_V1_5_Input = {
    text: string | string[];
    pooling?: "mean" | "cls";
} | {
    requests: {
        text: string | string[];
        pooling?: "mean" | "cls";
    }[];
};
type Ai_Cf_Baai_Bge_Small_En_V1_5_Output = {
    shape?: number[];
    data?: number[][];
    pooling?: "mean" | "cls";
} | Ai_Cf_Baai_Bge_Small_En_V1_5_AsyncResponse;
interface Ai_Cf_Baai_Bge_Small_En_V1_5_AsyncResponse {
    request_id?: string;
}
declare abstract class Base_Ai_Cf_Baai_Bge_Small_En_V1_5 {
    inputs: Ai_Cf_Baai_Bge_Small_En_V1_5_Input;
    postProcessedOutputs: Ai_Cf_Baai_Bge_Small_En_V1_5_Output;
}
type Ai_Cf_Baai_Bge_Large_En_V1_5_Input = {
    text: string | string[];
    pooling?: "mean" | "cls";
} | {
    requests: {
        text: string | string[];
        pooling?: "mean" | "cls";
    }[];
};
type Ai_Cf_Baai_Bge_Large_En_V1_5_Output = {
    shape?: number[];
    data?: number[][];
    pooling?: "mean" | "cls";
} | Ai_Cf_Baai_Bge_Large_En_V1_5_AsyncResponse;
interface Ai_Cf_Baai_Bge_Large_En_V1_5_AsyncResponse {
    request_id?: string;
}
declare abstract class Base_Ai_Cf_Baai_Bge_Large_En_V1_5 {
    inputs: Ai_Cf_Baai_Bge_Large_En_V1_5_Input;
    postProcessedOutputs: Ai_Cf_Baai_Bge_Large_En_V1_5_Output;
}
type Ai_Cf_Unum_Uform_Gen2_Qwen_500M_Input = string | {
    prompt?: string;
    raw?: boolean;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    image: number[] | (string & NonNullable<unknown>);
    max_tokens?: number;
};
interface Ai_Cf_Unum_Uform_Gen2_Qwen_500M_Output {
    description?: string;
}
declare abstract class Base_Ai_Cf_Unum_Uform_Gen2_Qwen_500M {
    inputs: Ai_Cf_Unum_Uform_Gen2_Qwen_500M_Input;
    postProcessedOutputs: Ai_Cf_Unum_Uform_Gen2_Qwen_500M_Output;
}
type Ai_Cf_Openai_Whisper_Tiny_En_Input = string | {
    audio: number[];
};
interface Ai_Cf_Openai_Whisper_Tiny_En_Output {
    text: string;
    word_count?: number;
    words?: {
        word?: string;
        start?: number;
        end?: number;
    }[];
    vtt?: string;
}
declare abstract class Base_Ai_Cf_Openai_Whisper_Tiny_En {
    inputs: Ai_Cf_Openai_Whisper_Tiny_En_Input;
    postProcessedOutputs: Ai_Cf_Openai_Whisper_Tiny_En_Output;
}
interface Ai_Cf_Openai_Whisper_Large_V3_Turbo_Input {
    audio: string | {
        body?: object;
        contentType?: string;
    };
    task?: string;
    language?: string;
    vad_filter?: boolean;
    initial_prompt?: string;
    prefix?: string;
    beam_size?: number;
    condition_on_previous_text?: boolean;
    no_speech_threshold?: number;
    compression_ratio_threshold?: number;
    log_prob_threshold?: number;
    hallucination_silence_threshold?: number;
}
interface Ai_Cf_Openai_Whisper_Large_V3_Turbo_Output {
    transcription_info?: {
        language?: string;
        language_probability?: number;
        duration?: number;
        duration_after_vad?: number;
    };
    text: string;
    word_count?: number;
    segments?: {
        start?: number;
        end?: number;
        text?: string;
        temperature?: number;
        avg_logprob?: number;
        compression_ratio?: number;
        no_speech_prob?: number;
        words?: {
            word?: string;
            start?: number;
            end?: number;
        }[];
    }[];
    vtt?: string;
}
declare abstract class Base_Ai_Cf_Openai_Whisper_Large_V3_Turbo {
    inputs: Ai_Cf_Openai_Whisper_Large_V3_Turbo_Input;
    postProcessedOutputs: Ai_Cf_Openai_Whisper_Large_V3_Turbo_Output;
}
type Ai_Cf_Baai_Bge_M3_Input = Ai_Cf_Baai_Bge_M3_Input_QueryAnd_Contexts | Ai_Cf_Baai_Bge_M3_Input_Embedding | {
    requests: (Ai_Cf_Baai_Bge_M3_Input_QueryAnd_Contexts_1 | Ai_Cf_Baai_Bge_M3_Input_Embedding_1)[];
};
interface Ai_Cf_Baai_Bge_M3_Input_QueryAnd_Contexts {
    query?: string;
    contexts: {
        text?: string;
    }[];
    truncate_inputs?: boolean;
}
interface Ai_Cf_Baai_Bge_M3_Input_Embedding {
    text: string | string[];
    truncate_inputs?: boolean;
}
interface Ai_Cf_Baai_Bge_M3_Input_QueryAnd_Contexts_1 {
    query?: string;
    contexts: {
        text?: string;
    }[];
    truncate_inputs?: boolean;
}
interface Ai_Cf_Baai_Bge_M3_Input_Embedding_1 {
    text: string | string[];
    truncate_inputs?: boolean;
}
type Ai_Cf_Baai_Bge_M3_Output = Ai_Cf_Baai_Bge_M3_Output_Query | Ai_Cf_Baai_Bge_M3_Output_EmbeddingFor_Contexts | Ai_Cf_Baai_Bge_M3_Output_Embedding | Ai_Cf_Baai_Bge_M3_AsyncResponse;
interface Ai_Cf_Baai_Bge_M3_Output_Query {
    response?: {
        id?: number;
        score?: number;
    }[];
}
interface Ai_Cf_Baai_Bge_M3_Output_EmbeddingFor_Contexts {
    response?: number[][];
    shape?: number[];
    pooling?: "mean" | "cls";
}
interface Ai_Cf_Baai_Bge_M3_Output_Embedding {
    shape?: number[];
    data?: number[][];
    pooling?: "mean" | "cls";
}
interface Ai_Cf_Baai_Bge_M3_AsyncResponse {
    request_id?: string;
}
declare abstract class Base_Ai_Cf_Baai_Bge_M3 {
    inputs: Ai_Cf_Baai_Bge_M3_Input;
    postProcessedOutputs: Ai_Cf_Baai_Bge_M3_Output;
}
interface Ai_Cf_Black_Forest_Labs_Flux_1_Schnell_Input {
    prompt: string;
    steps?: number;
}
interface Ai_Cf_Black_Forest_Labs_Flux_1_Schnell_Output {
    image?: string;
}
declare abstract class Base_Ai_Cf_Black_Forest_Labs_Flux_1_Schnell {
    inputs: Ai_Cf_Black_Forest_Labs_Flux_1_Schnell_Input;
    postProcessedOutputs: Ai_Cf_Black_Forest_Labs_Flux_1_Schnell_Output;
}
type Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct_Input = Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct_Prompt | Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct_Messages;
interface Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct_Prompt {
    prompt: string;
    image?: number[] | (string & NonNullable<unknown>);
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    lora?: string;
}
interface Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct_Messages {
    messages: {
        role?: string;
        tool_call_id?: string;
        content?: string | {
            type?: string;
            text?: string;
            image_url?: {
                url?: string;
            };
        }[] | {
            type?: string;
            text?: string;
            image_url?: {
                url?: string;
            };
        };
    }[];
    image?: number[] | (string & NonNullable<unknown>);
    functions?: {
        name: string;
        code: string;
    }[];
    tools?: ({
        name: string;
        description: string;
        parameters: {
            type: string;
            required?: string[];
            properties: {
                [k: string]: {
                    type: string;
                    description: string;
                };
            };
        };
    } | {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                required?: string[];
                properties: {
                    [k: string]: {
                        type: string;
                        description: string;
                    };
                };
            };
        };
    })[];
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
type Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct_Output = {
    response?: string;
    tool_calls?: {
        arguments?: object;
        name?: string;
    }[];
};
declare abstract class Base_Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct {
    inputs: Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct_Input;
    postProcessedOutputs: Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct_Output;
}
type Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Input = Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Prompt | Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Messages | Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Async_Batch;
interface Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Prompt {
    prompt: string;
    lora?: string;
    response_format?: Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_JSON_Mode;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_JSON_Mode {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
interface Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Messages {
    messages: {
        role: string;
        content: string | {
            type?: string;
            text?: string;
        }[];
    }[];
    functions?: {
        name: string;
        code: string;
    }[];
    tools?: ({
        name: string;
        description: string;
        parameters: {
            type: string;
            required?: string[];
            properties: {
                [k: string]: {
                    type: string;
                    description: string;
                };
            };
        };
    } | {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                required?: string[];
                properties: {
                    [k: string]: {
                        type: string;
                        description: string;
                    };
                };
            };
        };
    })[];
    response_format?: Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_JSON_Mode_1;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_JSON_Mode_1 {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
interface Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Async_Batch {
    requests?: {
        external_reference?: string;
        prompt?: string;
        stream?: boolean;
        max_tokens?: number;
        temperature?: number;
        top_p?: number;
        seed?: number;
        repetition_penalty?: number;
        frequency_penalty?: number;
        presence_penalty?: number;
        response_format?: Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_JSON_Mode_2;
    }[];
}
interface Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_JSON_Mode_2 {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
type Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Output = {
    response: string;
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
    tool_calls?: {
        arguments?: object;
        name?: string;
    }[];
} | string | Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_AsyncResponse;
interface Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_AsyncResponse {
    request_id?: string;
}
declare abstract class Base_Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast {
    inputs: Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Input;
    postProcessedOutputs: Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Output;
}
interface Ai_Cf_Meta_Llama_Guard_3_8B_Input {
    messages: {
        role: "user" | "assistant";
        content: string;
    }[];
    max_tokens?: number;
    temperature?: number;
    response_format?: {
        type?: string;
    };
}
interface Ai_Cf_Meta_Llama_Guard_3_8B_Output {
    response?: string | {
        safe?: boolean;
        categories?: string[];
    };
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
}
declare abstract class Base_Ai_Cf_Meta_Llama_Guard_3_8B {
    inputs: Ai_Cf_Meta_Llama_Guard_3_8B_Input;
    postProcessedOutputs: Ai_Cf_Meta_Llama_Guard_3_8B_Output;
}
interface Ai_Cf_Baai_Bge_Reranker_Base_Input {
    top_k?: number;
    contexts: {
        text?: string;
    }[];
}
interface Ai_Cf_Baai_Bge_Reranker_Base_Output {
    response?: {
        id?: number;
        score?: number;
    }[];
}
declare abstract class Base_Ai_Cf_Baai_Bge_Reranker_Base {
    inputs: Ai_Cf_Baai_Bge_Reranker_Base_Input;
    postProcessedOutputs: Ai_Cf_Baai_Bge_Reranker_Base_Output;
}
type Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_Input = Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_Prompt | Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_Messages;
interface Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_Prompt {
    prompt: string;
    lora?: string;
    response_format?: Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_JSON_Mode;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_JSON_Mode {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
interface Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_Messages {
    messages: {
        role: string;
        content: string;
    }[];
    functions?: {
        name: string;
        code: string;
    }[];
    tools?: ({
        name: string;
        description: string;
        parameters: {
            type: string;
            required?: string[];
            properties: {
                [k: string]: {
                    type: string;
                    description: string;
                };
            };
        };
    } | {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                required?: string[];
                properties: {
                    [k: string]: {
                        type: string;
                        description: string;
                    };
                };
            };
        };
    })[];
    response_format?: Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_JSON_Mode_1;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_JSON_Mode_1 {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
type Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_Output = {
    response: string;
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
    tool_calls?: {
        arguments?: object;
        name?: string;
    }[];
};
declare abstract class Base_Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct {
    inputs: Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_Input;
    postProcessedOutputs: Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_Output;
}
type Ai_Cf_Qwen_Qwq_32B_Input = Ai_Cf_Qwen_Qwq_32B_Prompt | Ai_Cf_Qwen_Qwq_32B_Messages;
interface Ai_Cf_Qwen_Qwq_32B_Prompt {
    prompt: string;
    guided_json?: object;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Qwen_Qwq_32B_Messages {
    messages: {
        role?: string;
        tool_call_id?: string;
        content?: string | {
            type?: string;
            text?: string;
            image_url?: {
                url?: string;
            };
        }[] | {
            type?: string;
            text?: string;
            image_url?: {
                url?: string;
            };
        };
    }[];
    functions?: {
        name: string;
        code: string;
    }[];
    tools?: ({
        name: string;
        description: string;
        parameters: {
            type: string;
            required?: string[];
            properties: {
                [k: string]: {
                    type: string;
                    description: string;
                };
            };
        };
    } | {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                required?: string[];
                properties: {
                    [k: string]: {
                        type: string;
                        description: string;
                    };
                };
            };
        };
    })[];
    guided_json?: object;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
type Ai_Cf_Qwen_Qwq_32B_Output = {
    response: string;
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
    tool_calls?: {
        arguments?: object;
        name?: string;
    }[];
};
declare abstract class Base_Ai_Cf_Qwen_Qwq_32B {
    inputs: Ai_Cf_Qwen_Qwq_32B_Input;
    postProcessedOutputs: Ai_Cf_Qwen_Qwq_32B_Output;
}
type Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct_Input = Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct_Prompt | Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct_Messages;
interface Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct_Prompt {
    prompt: string;
    guided_json?: object;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct_Messages {
    messages: {
        role?: string;
        tool_call_id?: string;
        content?: string | {
            type?: string;
            text?: string;
            image_url?: {
                url?: string;
            };
        }[] | {
            type?: string;
            text?: string;
            image_url?: {
                url?: string;
            };
        };
    }[];
    functions?: {
        name: string;
        code: string;
    }[];
    tools?: ({
        name: string;
        description: string;
        parameters: {
            type: string;
            required?: string[];
            properties: {
                [k: string]: {
                    type: string;
                    description: string;
                };
            };
        };
    } | {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                required?: string[];
                properties: {
                    [k: string]: {
                        type: string;
                        description: string;
                    };
                };
            };
        };
    })[];
    guided_json?: object;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
type Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct_Output = {
    response: string;
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
    tool_calls?: {
        arguments?: object;
        name?: string;
    }[];
};
declare abstract class Base_Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct {
    inputs: Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct_Input;
    postProcessedOutputs: Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct_Output;
}
type Ai_Cf_Google_Gemma_3_12B_It_Input = Ai_Cf_Google_Gemma_3_12B_It_Prompt | Ai_Cf_Google_Gemma_3_12B_It_Messages;
interface Ai_Cf_Google_Gemma_3_12B_It_Prompt {
    prompt: string;
    guided_json?: object;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Google_Gemma_3_12B_It_Messages {
    messages: {
        role?: string;
        content?: string | {
            type?: string;
            text?: string;
            image_url?: {
                url?: string;
            };
        }[];
    }[];
    functions?: {
        name: string;
        code: string;
    }[];
    tools?: ({
        name: string;
        description: string;
        parameters: {
            type: string;
            required?: string[];
            properties: {
                [k: string]: {
                    type: string;
                    description: string;
                };
            };
        };
    } | {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                required?: string[];
                properties: {
                    [k: string]: {
                        type: string;
                        description: string;
                    };
                };
            };
        };
    })[];
    guided_json?: object;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
type Ai_Cf_Google_Gemma_3_12B_It_Output = {
    response: string;
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
    tool_calls?: {
        arguments?: object;
        name?: string;
    }[];
};
declare abstract class Base_Ai_Cf_Google_Gemma_3_12B_It {
    inputs: Ai_Cf_Google_Gemma_3_12B_It_Input;
    postProcessedOutputs: Ai_Cf_Google_Gemma_3_12B_It_Output;
}
type Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Input = Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Prompt | Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Messages | Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Async_Batch;
interface Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Prompt {
    prompt: string;
    guided_json?: object;
    response_format?: Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_JSON_Mode;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_JSON_Mode {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
interface Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Messages {
    messages: {
        role?: string;
        tool_call_id?: string;
        content?: string | {
            type?: string;
            text?: string;
            image_url?: {
                url?: string;
            };
        }[] | {
            type?: string;
            text?: string;
            image_url?: {
                url?: string;
            };
        };
    }[];
    functions?: {
        name: string;
        code: string;
    }[];
    tools?: ({
        name: string;
        description: string;
        parameters: {
            type: string;
            required?: string[];
            properties: {
                [k: string]: {
                    type: string;
                    description: string;
                };
            };
        };
    } | {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                required?: string[];
                properties: {
                    [k: string]: {
                        type: string;
                        description: string;
                    };
                };
            };
        };
    })[];
    response_format?: Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_JSON_Mode;
    guided_json?: object;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Async_Batch {
    requests: (Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Prompt_Inner | Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Messages_Inner)[];
}
interface Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Prompt_Inner {
    prompt: string;
    guided_json?: object;
    response_format?: Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_JSON_Mode;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Messages_Inner {
    messages: {
        role?: string;
        tool_call_id?: string;
        content?: string | {
            type?: string;
            text?: string;
            image_url?: {
                url?: string;
            };
        }[] | {
            type?: string;
            text?: string;
            image_url?: {
                url?: string;
            };
        };
    }[];
    functions?: {
        name: string;
        code: string;
    }[];
    tools?: ({
        name: string;
        description: string;
        parameters: {
            type: string;
            required?: string[];
            properties: {
                [k: string]: {
                    type: string;
                    description: string;
                };
            };
        };
    } | {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                required?: string[];
                properties: {
                    [k: string]: {
                        type: string;
                        description: string;
                    };
                };
            };
        };
    })[];
    response_format?: Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_JSON_Mode;
    guided_json?: object;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
type Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Output = {
    response: string;
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
    tool_calls?: {
        id?: string;
        type?: string;
        function?: {
            name?: string;
            arguments?: object;
        };
    }[];
};
declare abstract class Base_Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct {
    inputs: Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Input;
    postProcessedOutputs: Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Output;
}
type Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Input = Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Prompt | Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Messages | Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Async_Batch;
interface Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Prompt {
    prompt: string;
    lora?: string;
    response_format?: Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
interface Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Messages {
    messages: {
        role: string;
        content: string | {
            type?: string;
            text?: string;
        }[];
    }[];
    functions?: {
        name: string;
        code: string;
    }[];
    tools?: ({
        name: string;
        description: string;
        parameters: {
            type: string;
            required?: string[];
            properties: {
                [k: string]: {
                    type: string;
                    description: string;
                };
            };
        };
    } | {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                required?: string[];
                properties: {
                    [k: string]: {
                        type: string;
                        description: string;
                    };
                };
            };
        };
    })[];
    response_format?: Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode_1;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode_1 {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
interface Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Async_Batch {
    requests: (Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Prompt_1 | Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Messages_1)[];
}
interface Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Prompt_1 {
    prompt: string;
    lora?: string;
    response_format?: Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode_2;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode_2 {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
interface Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Messages_1 {
    messages: {
        role: string;
        content: string | {
            type?: string;
            text?: string;
        }[];
    }[];
    functions?: {
        name: string;
        code: string;
    }[];
    tools?: ({
        name: string;
        description: string;
        parameters: {
            type: string;
            required?: string[];
            properties: {
                [k: string]: {
                    type: string;
                    description: string;
                };
            };
        };
    } | {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                required?: string[];
                properties: {
                    [k: string]: {
                        type: string;
                        description: string;
                    };
                };
            };
        };
    })[];
    response_format?: Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode_3;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode_3 {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
type Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Output = Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Chat_Completion_Response | Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Text_Completion_Response | string | Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_AsyncResponse;
interface Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Chat_Completion_Response {
    id?: string;
    object?: "chat.completion";
    created?: number;
    model?: string;
    choices?: {
        index?: number;
        message?: {
            role: string;
            content: string;
            reasoning_content?: string;
            tool_calls?: {
                id: string;
                type: "function";
                function: {
                    name: string;
                    arguments: string;
                };
            }[];
        };
        finish_reason?: string;
        stop_reason?: string | null;
        logprobs?: {} | null;
    }[];
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
    prompt_logprobs?: {} | null;
}
interface Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Text_Completion_Response {
    id?: string;
    object?: "text_completion";
    created?: number;
    model?: string;
    choices?: {
        index: number;
        text: string;
        finish_reason: string;
        stop_reason?: string | null;
        logprobs?: {} | null;
        prompt_logprobs?: {} | null;
    }[];
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
}
interface Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_AsyncResponse {
    request_id?: string;
}
declare abstract class Base_Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8 {
    inputs: Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Input;
    postProcessedOutputs: Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Output;
}
interface Ai_Cf_Deepgram_Nova_3_Input {
    audio: {
        body: object;
        contentType: string;
    };
    custom_topic_mode?: "extended" | "strict";
    custom_topic?: string;
    custom_intent_mode?: "extended" | "strict";
    custom_intent?: string;
    detect_entities?: boolean;
    detect_language?: boolean;
    diarize?: boolean;
    dictation?: boolean;
    encoding?: "linear16" | "flac" | "mulaw" | "amr-nb" | "amr-wb" | "opus" | "speex" | "g729";
    extra?: string;
    filler_words?: boolean;
    keyterm?: string;
    keywords?: string;
    language?: string;
    measurements?: boolean;
    mip_opt_out?: boolean;
    mode?: "general" | "medical" | "finance";
    multichannel?: boolean;
    numerals?: boolean;
    paragraphs?: boolean;
    profanity_filter?: boolean;
    punctuate?: boolean;
    redact?: string;
    replace?: string;
    search?: string;
    sentiment?: boolean;
    smart_format?: boolean;
    topics?: boolean;
    utterances?: boolean;
    utt_split?: number;
    channels?: number;
    interim_results?: boolean;
    endpointing?: string;
    vad_events?: boolean;
    utterance_end_ms?: boolean;
}
interface Ai_Cf_Deepgram_Nova_3_Output {
    results?: {
        channels?: {
            alternatives?: {
                confidence?: number;
                transcript?: string;
                words?: {
                    confidence?: number;
                    end?: number;
                    start?: number;
                    word?: string;
                }[];
            }[];
        }[];
        summary?: {
            result?: string;
            short?: string;
        };
        sentiments?: {
            segments?: {
                text?: string;
                start_word?: number;
                end_word?: number;
                sentiment?: string;
                sentiment_score?: number;
            }[];
            average?: {
                sentiment?: string;
                sentiment_score?: number;
            };
        };
    };
}
declare abstract class Base_Ai_Cf_Deepgram_Nova_3 {
    inputs: Ai_Cf_Deepgram_Nova_3_Input;
    postProcessedOutputs: Ai_Cf_Deepgram_Nova_3_Output;
}
interface Ai_Cf_Qwen_Qwen3_Embedding_0_6B_Input {
    queries?: string | string[];
    instruction?: string;
    documents?: string | string[];
    text?: string | string[];
}
interface Ai_Cf_Qwen_Qwen3_Embedding_0_6B_Output {
    data?: number[][];
    shape?: number[];
}
declare abstract class Base_Ai_Cf_Qwen_Qwen3_Embedding_0_6B {
    inputs: Ai_Cf_Qwen_Qwen3_Embedding_0_6B_Input;
    postProcessedOutputs: Ai_Cf_Qwen_Qwen3_Embedding_0_6B_Output;
}
type Ai_Cf_Pipecat_Ai_Smart_Turn_V2_Input = {
    audio: {
        body: object;
        contentType: string;
    };
    dtype?: "uint8" | "float32" | "float64";
} | {
    audio: string;
    dtype?: "uint8" | "float32" | "float64";
};
interface Ai_Cf_Pipecat_Ai_Smart_Turn_V2_Output {
    is_complete?: boolean;
    probability?: number;
}
declare abstract class Base_Ai_Cf_Pipecat_Ai_Smart_Turn_V2 {
    inputs: Ai_Cf_Pipecat_Ai_Smart_Turn_V2_Input;
    postProcessedOutputs: Ai_Cf_Pipecat_Ai_Smart_Turn_V2_Output;
}
declare abstract class Base_Ai_Cf_Openai_Gpt_Oss_120B {
    inputs: XOR<ResponsesInput, ChatCompletionsMessagesInput>;
    postProcessedOutputs: XOR<ResponsesOutput, ChatCompletionsOutput>;
}
declare abstract class Base_Ai_Cf_Openai_Gpt_Oss_20B {
    inputs: XOR<ResponsesInput, ChatCompletionsMessagesInput>;
    postProcessedOutputs: XOR<ResponsesOutput, ChatCompletionsOutput>;
}
interface Ai_Cf_Leonardo_Phoenix_1_0_Input {
    prompt: string;
    guidance?: number;
    seed?: number;
    height?: number;
    width?: number;
    num_steps?: number;
    negative_prompt?: string;
}
type Ai_Cf_Leonardo_Phoenix_1_0_Output = string;
declare abstract class Base_Ai_Cf_Leonardo_Phoenix_1_0 {
    inputs: Ai_Cf_Leonardo_Phoenix_1_0_Input;
    postProcessedOutputs: Ai_Cf_Leonardo_Phoenix_1_0_Output;
}
interface Ai_Cf_Leonardo_Lucid_Origin_Input {
    prompt: string;
    guidance?: number;
    seed?: number;
    height?: number;
    width?: number;
    num_steps?: number;
    steps?: number;
}
interface Ai_Cf_Leonardo_Lucid_Origin_Output {
    image?: string;
}
declare abstract class Base_Ai_Cf_Leonardo_Lucid_Origin {
    inputs: Ai_Cf_Leonardo_Lucid_Origin_Input;
    postProcessedOutputs: Ai_Cf_Leonardo_Lucid_Origin_Output;
}
interface Ai_Cf_Deepgram_Aura_1_Input {
    speaker?: "angus" | "asteria" | "arcas" | "orion" | "orpheus" | "athena" | "luna" | "zeus" | "perseus" | "helios" | "hera" | "stella";
    encoding?: "linear16" | "flac" | "mulaw" | "alaw" | "mp3" | "opus" | "aac";
    container?: "none" | "wav" | "ogg";
    text: string;
    sample_rate?: number;
    bit_rate?: number;
}
type Ai_Cf_Deepgram_Aura_1_Output = string;
declare abstract class Base_Ai_Cf_Deepgram_Aura_1 {
    inputs: Ai_Cf_Deepgram_Aura_1_Input;
    postProcessedOutputs: Ai_Cf_Deepgram_Aura_1_Output;
}
interface Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Input {
    text: string | string[];
    target_language: "asm_Beng" | "awa_Deva" | "ben_Beng" | "bho_Deva" | "brx_Deva" | "doi_Deva" | "eng_Latn" | "gom_Deva" | "gon_Deva" | "guj_Gujr" | "hin_Deva" | "hne_Deva" | "kan_Knda" | "kas_Arab" | "kas_Deva" | "kha_Latn" | "lus_Latn" | "mag_Deva" | "mai_Deva" | "mal_Mlym" | "mar_Deva" | "mni_Beng" | "mni_Mtei" | "npi_Deva" | "ory_Orya" | "pan_Guru" | "san_Deva" | "sat_Olck" | "snd_Arab" | "snd_Deva" | "tam_Taml" | "tel_Telu" | "urd_Arab" | "unr_Deva";
}
interface Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Output {
    translations: string[];
}
declare abstract class Base_Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B {
    inputs: Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Input;
    postProcessedOutputs: Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Output;
}
type Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Input = Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Prompt | Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Messages | Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Async_Batch;
interface Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Prompt {
    prompt: string;
    lora?: string;
    response_format?: Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
interface Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Messages {
    messages: {
        role: string;
        content: string | {
            type?: string;
            text?: string;
        }[];
    }[];
    functions?: {
        name: string;
        code: string;
    }[];
    tools?: ({
        name: string;
        description: string;
        parameters: {
            type: string;
            required?: string[];
            properties: {
                [k: string]: {
                    type: string;
                    description: string;
                };
            };
        };
    } | {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                required?: string[];
                properties: {
                    [k: string]: {
                        type: string;
                        description: string;
                    };
                };
            };
        };
    })[];
    response_format?: Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode_1;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode_1 {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
interface Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Async_Batch {
    requests: (Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Prompt_1 | Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Messages_1)[];
}
interface Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Prompt_1 {
    prompt: string;
    lora?: string;
    response_format?: Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode_2;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode_2 {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
interface Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Messages_1 {
    messages: {
        role: string;
        content: string | {
            type?: string;
            text?: string;
        }[];
    }[];
    functions?: {
        name: string;
        code: string;
    }[];
    tools?: ({
        name: string;
        description: string;
        parameters: {
            type: string;
            required?: string[];
            properties: {
                [k: string]: {
                    type: string;
                    description: string;
                };
            };
        };
    } | {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                required?: string[];
                properties: {
                    [k: string]: {
                        type: string;
                        description: string;
                    };
                };
            };
        };
    })[];
    response_format?: Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode_3;
    raw?: boolean;
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    repetition_penalty?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}
interface Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode_3 {
    type?: "json_object" | "json_schema";
    json_schema?: unknown;
}
type Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Output = Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Chat_Completion_Response | Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Text_Completion_Response | string | Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_AsyncResponse;
interface Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Chat_Completion_Response {
    id?: string;
    object?: "chat.completion";
    created?: number;
    model?: string;
    choices?: {
        index?: number;
        message?: {
            role: string;
            content: string;
            reasoning_content?: string;
            tool_calls?: {
                id: string;
                type: "function";
                function: {
                    name: string;
                    arguments: string;
                };
            }[];
        };
        finish_reason?: string;
        stop_reason?: string | null;
        logprobs?: {} | null;
    }[];
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
    prompt_logprobs?: {} | null;
}
interface Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Text_Completion_Response {
    id?: string;
    object?: "text_completion";
    created?: number;
    model?: string;
    choices?: {
        index: number;
        text: string;
        finish_reason: string;
        stop_reason?: string | null;
        logprobs?: {} | null;
        prompt_logprobs?: {} | null;
    }[];
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
}
interface Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_AsyncResponse {
    request_id?: string;
}
declare abstract class Base_Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It {
    inputs: Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Input;
    postProcessedOutputs: Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Output;
}
interface Ai_Cf_Pfnet_Plamo_Embedding_1B_Input {
    text: string | string[];
}
interface Ai_Cf_Pfnet_Plamo_Embedding_1B_Output {
    data: number[][];
    shape: [
        number,
        number
    ];
}
declare abstract class Base_Ai_Cf_Pfnet_Plamo_Embedding_1B {
    inputs: Ai_Cf_Pfnet_Plamo_Embedding_1B_Input;
    postProcessedOutputs: Ai_Cf_Pfnet_Plamo_Embedding_1B_Output;
}
interface Ai_Cf_Deepgram_Flux_Input {
    encoding: "linear16";
    sample_rate: string;
    eager_eot_threshold?: string;
    eot_threshold?: string;
    eot_timeout_ms?: string;
    keyterm?: string;
    mip_opt_out?: "true" | "false";
    tag?: string;
}
interface Ai_Cf_Deepgram_Flux_Output {
    request_id?: string;
    sequence_id?: number;
    event?: "Update" | "StartOfTurn" | "EagerEndOfTurn" | "TurnResumed" | "EndOfTurn";
    turn_index?: number;
    audio_window_start?: number;
    audio_window_end?: number;
    transcript?: string;
    words?: {
        word: string;
        confidence: number;
    }[];
    end_of_turn_confidence?: number;
}
declare abstract class Base_Ai_Cf_Deepgram_Flux {
    inputs: Ai_Cf_Deepgram_Flux_Input;
    postProcessedOutputs: Ai_Cf_Deepgram_Flux_Output;
}
interface Ai_Cf_Deepgram_Aura_2_En_Input {
    speaker?: "amalthea" | "andromeda" | "apollo" | "arcas" | "aries" | "asteria" | "athena" | "atlas" | "aurora" | "callista" | "cora" | "cordelia" | "delia" | "draco" | "electra" | "harmonia" | "helena" | "hera" | "hermes" | "hyperion" | "iris" | "janus" | "juno" | "jupiter" | "luna" | "mars" | "minerva" | "neptune" | "odysseus" | "ophelia" | "orion" | "orpheus" | "pandora" | "phoebe" | "pluto" | "saturn" | "thalia" | "theia" | "vesta" | "zeus";
    encoding?: "linear16" | "flac" | "mulaw" | "alaw" | "mp3" | "opus" | "aac";
    container?: "none" | "wav" | "ogg";
    text: string;
    sample_rate?: number;
    bit_rate?: number;
}
type Ai_Cf_Deepgram_Aura_2_En_Output = string;
declare abstract class Base_Ai_Cf_Deepgram_Aura_2_En {
    inputs: Ai_Cf_Deepgram_Aura_2_En_Input;
    postProcessedOutputs: Ai_Cf_Deepgram_Aura_2_En_Output;
}
interface Ai_Cf_Deepgram_Aura_2_Es_Input {
    speaker?: "sirio" | "nestor" | "carina" | "celeste" | "alvaro" | "diana" | "aquila" | "selena" | "estrella" | "javier";
    encoding?: "linear16" | "flac" | "mulaw" | "alaw" | "mp3" | "opus" | "aac";
    container?: "none" | "wav" | "ogg";
    text: string;
    sample_rate?: number;
    bit_rate?: number;
}
type Ai_Cf_Deepgram_Aura_2_Es_Output = string;
declare abstract class Base_Ai_Cf_Deepgram_Aura_2_Es {
    inputs: Ai_Cf_Deepgram_Aura_2_Es_Input;
    postProcessedOutputs: Ai_Cf_Deepgram_Aura_2_Es_Output;
}
interface Ai_Cf_Black_Forest_Labs_Flux_2_Dev_Input {
    multipart: {
        body?: object;
        contentType?: string;
    };
}
interface Ai_Cf_Black_Forest_Labs_Flux_2_Dev_Output {
    image?: string;
}
declare abstract class Base_Ai_Cf_Black_Forest_Labs_Flux_2_Dev {
    inputs: Ai_Cf_Black_Forest_Labs_Flux_2_Dev_Input;
    postProcessedOutputs: Ai_Cf_Black_Forest_Labs_Flux_2_Dev_Output;
}
interface Ai_Cf_Black_Forest_Labs_Flux_2_Klein_4B_Input {
    multipart: {
        body?: object;
        contentType?: string;
    };
}
interface Ai_Cf_Black_Forest_Labs_Flux_2_Klein_4B_Output {
    image?: string;
}
declare abstract class Base_Ai_Cf_Black_Forest_Labs_Flux_2_Klein_4B {
    inputs: Ai_Cf_Black_Forest_Labs_Flux_2_Klein_4B_Input;
    postProcessedOutputs: Ai_Cf_Black_Forest_Labs_Flux_2_Klein_4B_Output;
}
interface Ai_Cf_Black_Forest_Labs_Flux_2_Klein_9B_Input {
    multipart: {
        body?: object;
        contentType?: string;
    };
}
interface Ai_Cf_Black_Forest_Labs_Flux_2_Klein_9B_Output {
    image?: string;
}
declare abstract class Base_Ai_Cf_Black_Forest_Labs_Flux_2_Klein_9B {
    inputs: Ai_Cf_Black_Forest_Labs_Flux_2_Klein_9B_Input;
    postProcessedOutputs: Ai_Cf_Black_Forest_Labs_Flux_2_Klein_9B_Output;
}
declare abstract class Base_Ai_Cf_Zai_Org_Glm_4_7_Flash {
    inputs: ChatCompletionsInput;
    postProcessedOutputs: ChatCompletionsOutput;
}
declare abstract class Base_Ai_Cf_Moonshotai_Kimi_K2_5 {
    inputs: ChatCompletionsInput;
    postProcessedOutputs: ChatCompletionsOutput;
}
declare abstract class Base_Ai_Cf_Moonshotai_Kimi_K2_6 {
    inputs: ChatCompletionsInput;
    postProcessedOutputs: ChatCompletionsOutput;
}
declare abstract class Base_Ai_Cf_Nvidia_Nemotron_3_120B_A12B {
    inputs: ChatCompletionsInput;
    postProcessedOutputs: ChatCompletionsOutput;
}
declare abstract class Base_Ai_Cf_Google_Gemma_4_26B_A4B_IT {
    inputs: ChatCompletionsInput;
    postProcessedOutputs: ChatCompletionsOutput;
}
interface AiModels {
    "@cf/huggingface/distilbert-sst-2-int8": BaseAiTextClassification;
    "@cf/stabilityai/stable-diffusion-xl-base-1.0": BaseAiTextToImage;
    "@cf/runwayml/stable-diffusion-v1-5-inpainting": BaseAiTextToImage;
    "@cf/runwayml/stable-diffusion-v1-5-img2img": BaseAiTextToImage;
    "@cf/lykon/dreamshaper-8-lcm": BaseAiTextToImage;
    "@cf/bytedance/stable-diffusion-xl-lightning": BaseAiTextToImage;
    "@cf/myshell-ai/melotts": BaseAiTextToSpeech;
    "@cf/google/embeddinggemma-300m": BaseAiTextEmbeddings;
    "@cf/microsoft/resnet-50": BaseAiImageClassification;
    "@cf/meta/llama-2-7b-chat-int8": BaseAiTextGeneration;
    "@cf/mistral/mistral-7b-instruct-v0.1": BaseAiTextGeneration;
    "@cf/meta/llama-2-7b-chat-fp16": BaseAiTextGeneration;
    "@hf/thebloke/llama-2-13b-chat-awq": BaseAiTextGeneration;
    "@hf/thebloke/mistral-7b-instruct-v0.1-awq": BaseAiTextGeneration;
    "@hf/thebloke/zephyr-7b-beta-awq": BaseAiTextGeneration;
    "@hf/thebloke/openhermes-2.5-mistral-7b-awq": BaseAiTextGeneration;
    "@hf/thebloke/neural-chat-7b-v3-1-awq": BaseAiTextGeneration;
    "@hf/thebloke/deepseek-coder-6.7b-base-awq": BaseAiTextGeneration;
    "@hf/thebloke/deepseek-coder-6.7b-instruct-awq": BaseAiTextGeneration;
    "@cf/deepseek-ai/deepseek-math-7b-instruct": BaseAiTextGeneration;
    "@cf/defog/sqlcoder-7b-2": BaseAiTextGeneration;
    "@cf/openchat/openchat-3.5-0106": BaseAiTextGeneration;
    "@cf/tiiuae/falcon-7b-instruct": BaseAiTextGeneration;
    "@cf/thebloke/discolm-german-7b-v1-awq": BaseAiTextGeneration;
    "@cf/qwen/qwen1.5-0.5b-chat": BaseAiTextGeneration;
    "@cf/qwen/qwen1.5-7b-chat-awq": BaseAiTextGeneration;
    "@cf/qwen/qwen1.5-14b-chat-awq": BaseAiTextGeneration;
    "@cf/tinyllama/tinyllama-1.1b-chat-v1.0": BaseAiTextGeneration;
    "@cf/microsoft/phi-2": BaseAiTextGeneration;
    "@cf/qwen/qwen1.5-1.8b-chat": BaseAiTextGeneration;
    "@cf/mistral/mistral-7b-instruct-v0.2-lora": BaseAiTextGeneration;
    "@hf/nousresearch/hermes-2-pro-mistral-7b": BaseAiTextGeneration;
    "@hf/nexusflow/starling-lm-7b-beta": BaseAiTextGeneration;
    "@hf/google/gemma-7b-it": BaseAiTextGeneration;
    "@cf/meta-llama/llama-2-7b-chat-hf-lora": BaseAiTextGeneration;
    "@cf/google/gemma-2b-it-lora": BaseAiTextGeneration;
    "@cf/google/gemma-7b-it-lora": BaseAiTextGeneration;
    "@hf/mistral/mistral-7b-instruct-v0.2": BaseAiTextGeneration;
    "@cf/meta/llama-3-8b-instruct": BaseAiTextGeneration;
    "@cf/fblgit/una-cybertron-7b-v2-bf16": BaseAiTextGeneration;
    "@cf/meta/llama-3-8b-instruct-awq": BaseAiTextGeneration;
    "@cf/meta/llama-3.1-8b-instruct-fp8": BaseAiTextGeneration;
    "@cf/meta/llama-3.1-8b-instruct-awq": BaseAiTextGeneration;
    "@cf/meta/llama-3.2-3b-instruct": BaseAiTextGeneration;
    "@cf/meta/llama-3.2-1b-instruct": BaseAiTextGeneration;
    "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b": BaseAiTextGeneration;
    "@cf/ibm-granite/granite-4.0-h-micro": BaseAiTextGeneration;
    "@cf/facebook/bart-large-cnn": BaseAiSummarization;
    "@cf/llava-hf/llava-1.5-7b-hf": BaseAiImageToText;
    "@cf/baai/bge-base-en-v1.5": Base_Ai_Cf_Baai_Bge_Base_En_V1_5;
    "@cf/openai/whisper": Base_Ai_Cf_Openai_Whisper;
    "@cf/meta/m2m100-1.2b": Base_Ai_Cf_Meta_M2M100_1_2B;
    "@cf/baai/bge-small-en-v1.5": Base_Ai_Cf_Baai_Bge_Small_En_V1_5;
    "@cf/baai/bge-large-en-v1.5": Base_Ai_Cf_Baai_Bge_Large_En_V1_5;
    "@cf/unum/uform-gen2-qwen-500m": Base_Ai_Cf_Unum_Uform_Gen2_Qwen_500M;
    "@cf/openai/whisper-tiny-en": Base_Ai_Cf_Openai_Whisper_Tiny_En;
    "@cf/openai/whisper-large-v3-turbo": Base_Ai_Cf_Openai_Whisper_Large_V3_Turbo;
    "@cf/baai/bge-m3": Base_Ai_Cf_Baai_Bge_M3;
    "@cf/black-forest-labs/flux-1-schnell": Base_Ai_Cf_Black_Forest_Labs_Flux_1_Schnell;
    "@cf/meta/llama-3.2-11b-vision-instruct": Base_Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct;
    "@cf/meta/llama-3.3-70b-instruct-fp8-fast": Base_Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast;
    "@cf/meta/llama-guard-3-8b": Base_Ai_Cf_Meta_Llama_Guard_3_8B;
    "@cf/baai/bge-reranker-base": Base_Ai_Cf_Baai_Bge_Reranker_Base;
    "@cf/qwen/qwen2.5-coder-32b-instruct": Base_Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct;
    "@cf/qwen/qwq-32b": Base_Ai_Cf_Qwen_Qwq_32B;
    "@cf/mistralai/mistral-small-3.1-24b-instruct": Base_Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct;
    "@cf/google/gemma-3-12b-it": Base_Ai_Cf_Google_Gemma_3_12B_It;
    "@cf/meta/llama-4-scout-17b-16e-instruct": Base_Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct;
    "@cf/qwen/qwen3-30b-a3b-fp8": Base_Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8;
    "@cf/deepgram/nova-3": Base_Ai_Cf_Deepgram_Nova_3;
    "@cf/qwen/qwen3-embedding-0.6b": Base_Ai_Cf_Qwen_Qwen3_Embedding_0_6B;
    "@cf/pipecat-ai/smart-turn-v2": Base_Ai_Cf_Pipecat_Ai_Smart_Turn_V2;
    "@cf/openai/gpt-oss-120b": Base_Ai_Cf_Openai_Gpt_Oss_120B;
    "@cf/openai/gpt-oss-20b": Base_Ai_Cf_Openai_Gpt_Oss_20B;
    "@cf/leonardo/phoenix-1.0": Base_Ai_Cf_Leonardo_Phoenix_1_0;
    "@cf/leonardo/lucid-origin": Base_Ai_Cf_Leonardo_Lucid_Origin;
    "@cf/deepgram/aura-1": Base_Ai_Cf_Deepgram_Aura_1;
    "@cf/ai4bharat/indictrans2-en-indic-1B": Base_Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B;
    "@cf/aisingapore/gemma-sea-lion-v4-27b-it": Base_Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It;
    "@cf/pfnet/plamo-embedding-1b": Base_Ai_Cf_Pfnet_Plamo_Embedding_1B;
    "@cf/deepgram/flux": Base_Ai_Cf_Deepgram_Flux;
    "@cf/deepgram/aura-2-en": Base_Ai_Cf_Deepgram_Aura_2_En;
    "@cf/deepgram/aura-2-es": Base_Ai_Cf_Deepgram_Aura_2_Es;
    "@cf/black-forest-labs/flux-2-dev": Base_Ai_Cf_Black_Forest_Labs_Flux_2_Dev;
    "@cf/black-forest-labs/flux-2-klein-4b": Base_Ai_Cf_Black_Forest_Labs_Flux_2_Klein_4B;
    "@cf/black-forest-labs/flux-2-klein-9b": Base_Ai_Cf_Black_Forest_Labs_Flux_2_Klein_9B;
    "@cf/zai-org/glm-4.7-flash": Base_Ai_Cf_Zai_Org_Glm_4_7_Flash;
    "@cf/moonshotai/kimi-k2.5": Base_Ai_Cf_Moonshotai_Kimi_K2_5;
    "@cf/moonshotai/kimi-k2.6": Base_Ai_Cf_Moonshotai_Kimi_K2_6;
    "@cf/nvidia/nemotron-3-120b-a12b": Base_Ai_Cf_Nvidia_Nemotron_3_120B_A12B;
    "@cf/google/gemma-4-26b-a4b-it": Base_Ai_Cf_Google_Gemma_4_26B_A4B_IT;
}
type AiOptions = {
    queueRequest?: boolean;
    websocket?: boolean;
    tags?: string[];
    gateway?: GatewayOptions;
    returnRawResponse?: boolean;
    prefix?: string;
    extraHeaders?: object;
    signal?: AbortSignal;
};
type AiModelsSearchParams = {
    author?: string;
    hide_experimental?: boolean;
    page?: number;
    per_page?: number;
    search?: string;
    source?: number;
    task?: string;
};
type AiModelsSearchObject = {
    id: string;
    source: number;
    name: string;
    description: string;
    task: {
        id: string;
        name: string;
        description: string;
    };
    tags: string[];
    properties: {
        property_id: string;
        value: string;
    }[];
};
type ChatCompletionsBase = ChatCompletionsMessagesInput;
type ChatCompletionsInput = ChatCompletionsMessagesInput;
interface InferenceUpstreamError extends Error {
}
interface AiInternalError extends Error {
}
type AiModelListType = Record<string, any>;
type AiAsyncBatchResponse = {
    request_id: string;
};
declare abstract class Ai<AiModelList extends AiModelListType = AiModels> {
    aiGatewayLogId: string | null;
    gateway(gatewayId: string): AiGateway;
    aiSearch(): AiSearchNamespace;
    autorag(autoragId: string): AutoRAG;
    run<Name extends keyof AiModelList>(model: Name, inputs: {
        requests: AiModelList[Name]['inputs'][];
    }, options: AiOptions & {
        queueRequest: true;
    }): Promise<AiAsyncBatchResponse>;
    run<Name extends keyof AiModelList>(model: Name, inputs: AiModelList[Name]['inputs'], options: AiOptions & {
        returnRawResponse: true;
    }): Promise<Response>;
    run<Name extends keyof AiModelList>(model: Name, inputs: AiModelList[Name]['inputs'], options: AiOptions & {
        websocket: true;
    }): Promise<Response>;
    run<Name extends keyof AiModelList>(model: Name, inputs: AiModelList[Name]['inputs'] & {
        stream: true;
    }, options?: AiOptions): Promise<ReadableStream>;
    run<Name extends keyof AiModelList>(model: Name, inputs: AiModelList[Name]['inputs'], options?: AiOptions): Promise<AiModelList[Name]['postProcessedOutputs']>;
    run<Model extends string>(model: Model extends keyof AiModelList ? never : Model, inputs: Record<string, unknown>, options?: AiOptions): Promise<Record<string, unknown>>;
    models(params?: AiModelsSearchParams): Promise<AiModelsSearchObject[]>;
    toMarkdown(): ToMarkdownService;
    toMarkdown(files: MarkdownDocument[], options?: ConversionRequestOptions): Promise<ConversionResponse[]>;
    toMarkdown(files: MarkdownDocument, options?: ConversionRequestOptions): Promise<ConversionResponse>;
}
type GatewayRetries = {
    maxAttempts?: 1 | 2 | 3 | 4 | 5;
    retryDelayMs?: number;
    backoff?: 'constant' | 'linear' | 'exponential';
};
type GatewayOptions = {
    id: string;
    cacheKey?: string;
    cacheTtl?: number;
    skipCache?: boolean;
    metadata?: Record<string, number | string | boolean | null | bigint>;
    collectLog?: boolean;
    eventId?: string;
    requestTimeoutMs?: number;
    retries?: GatewayRetries;
};
type UniversalGatewayOptions = Exclude<GatewayOptions, 'id'> & {
    id?: string;
};
type AiGatewayPatchLog = {
    score?: number | null;
    feedback?: -1 | 1 | null;
    metadata?: Record<string, number | string | boolean | null | bigint> | null;
};
type AiGatewayLog = {
    id: string;
    provider: string;
    model: string;
    model_type?: string;
    path: string;
    duration: number;
    request_type?: string;
    request_content_type?: string;
    status_code: number;
    response_content_type?: string;
    success: boolean;
    cached: boolean;
    tokens_in?: number;
    tokens_out?: number;
    metadata?: Record<string, number | string | boolean | null | bigint>;
    step?: number;
    cost?: number;
    custom_cost?: boolean;
    request_size: number;
    request_head?: string;
    request_head_complete: boolean;
    response_size: number;
    response_head?: string;
    response_head_complete: boolean;
    created_at: Date;
};
type AIGatewayProviders = 'workers-ai' | 'anthropic' | 'aws-bedrock' | 'azure-openai' | 'google-vertex-ai' | 'huggingface' | 'openai' | 'perplexity-ai' | 'replicate' | 'groq' | 'cohere' | 'google-ai-studio' | 'mistral' | 'grok' | 'openrouter' | 'deepseek' | 'cerebras' | 'cartesia' | 'elevenlabs' | 'adobe-firefly';
type AIGatewayHeaders = {
    'cf-aig-metadata': Record<string, number | string | boolean | null | bigint> | string;
    'cf-aig-custom-cost': {
        per_token_in?: number;
        per_token_out?: number;
    } | {
        total_cost?: number;
    } | string;
    'cf-aig-cache-ttl': number | string;
    'cf-aig-skip-cache': boolean | string;
    'cf-aig-cache-key': string;
    'cf-aig-event-id': string;
    'cf-aig-request-timeout': number | string;
    'cf-aig-max-attempts': number | string;
    'cf-aig-retry-delay': number | string;
    'cf-aig-backoff': string;
    'cf-aig-collect-log': boolean | string;
    Authorization: string;
    'Content-Type': string;
    [key: string]: string | number | boolean | object;
};
type AIGatewayUniversalRequest = {
    provider: AIGatewayProviders | string;
    endpoint: string;
    headers: Partial<AIGatewayHeaders>;
    query: unknown;
};
interface AiGatewayInternalError extends Error {
}
interface AiGatewayLogNotFound extends Error {
}
declare abstract class AiGateway {
    patchLog(logId: string, data: AiGatewayPatchLog): Promise<void>;
    getLog(logId: string): Promise<AiGatewayLog>;
    run(data: AIGatewayUniversalRequest | AIGatewayUniversalRequest[], options?: {
        gateway?: UniversalGatewayOptions;
        extraHeaders?: object;
        signal?: AbortSignal;
    }): Promise<Response>;
    getUrl(provider?: AIGatewayProviders | string): Promise<string>;
}
interface ArtifactsRepoInfo {
    id: string;
    name: string;
    description: string | null;
    defaultBranch: string;
    createdAt: string;
    updatedAt: string;
    lastPushAt: string | null;
    source: string | null;
    readOnly: boolean;
    remote: string;
}
interface ArtifactsCreateRepoResult {
    id: string;
    name: string;
    description: string | null;
    defaultBranch: string;
    remote: string;
    token: string;
    tokenExpiresAt: string;
}
interface ArtifactsRepoListResult {
    repos: Omit<ArtifactsRepoInfo, 'remote'>[];
    total: number;
    cursor?: string;
}
interface ArtifactsCreateTokenResult {
    id: string;
    plaintext: string;
    scope: 'read' | 'write';
    expiresAt: string;
}
interface ArtifactsTokenInfo {
    id: string;
    scope: 'read' | 'write';
    state: 'active' | 'expired' | 'revoked';
    createdAt: string;
    expiresAt: string;
}
interface ArtifactsTokenListResult {
    tokens: ArtifactsTokenInfo[];
    total: number;
}
interface ArtifactsRepo extends ArtifactsRepoInfo {
    createToken(scope?: 'write' | 'read', ttl?: number): Promise<ArtifactsCreateTokenResult>;
    listTokens(): Promise<ArtifactsTokenListResult>;
    revokeToken(tokenOrId: string): Promise<boolean>;
    fork(name: string, opts?: {
        description?: string;
        readOnly?: boolean;
        defaultBranchOnly?: boolean;
    }): Promise<ArtifactsCreateRepoResult>;
}
type ArtifactsErrorCode = 'ALREADY_EXISTS' | 'NOT_FOUND' | 'IMPORT_IN_PROGRESS' | 'FORK_IN_PROGRESS' | 'INVALID_INPUT' | 'INVALID_REPO_NAME' | 'INVALID_TTL' | 'INVALID_URL' | 'REMOTE_AUTH_REQUIRED' | 'UPSTREAM_UNAVAILABLE' | 'MEMORY_LIMIT' | 'INTERNAL_ERROR';
interface ArtifactsError extends Error {
    readonly name: 'ArtifactsError';
    readonly code: ArtifactsErrorCode;
    readonly numericCode: number;
}
interface Artifacts {
    create(name: string, opts?: {
        readOnly?: boolean;
        description?: string;
        setDefaultBranch?: string;
    }): Promise<ArtifactsCreateRepoResult>;
    get(name: string): Promise<ArtifactsRepo>;
    import(params: {
        source: {
            url: string;
            branch?: string;
            depth?: number;
        };
        target: {
            name: string;
            opts?: {
                description?: string;
                readOnly?: boolean;
            };
        };
    }): Promise<ArtifactsCreateRepoResult>;
    list(opts?: {
        limit?: number;
        cursor?: string;
    }): Promise<ArtifactsRepoListResult>;
    delete(name: string): Promise<boolean>;
}
interface AutoRAGInternalError extends Error {
}
interface AutoRAGNotFoundError extends Error {
}
interface AutoRAGUnauthorizedError extends Error {
}
interface AutoRAGNameNotSetError extends Error {
}
type ComparisonFilter = {
    key: string;
    type: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte';
    value: string | number | boolean;
};
type CompoundFilter = {
    type: 'and' | 'or';
    filters: ComparisonFilter[];
};
type AutoRagSearchRequest = {
    query: string;
    filters?: CompoundFilter | ComparisonFilter;
    max_num_results?: number;
    ranking_options?: {
        ranker?: string;
        score_threshold?: number;
    };
    reranking?: {
        enabled?: boolean;
        model?: string;
    };
    rewrite_query?: boolean;
};
type AutoRagAiSearchRequest = AutoRagSearchRequest & {
    stream?: boolean;
    system_prompt?: string;
};
type AutoRagAiSearchRequestStreaming = Omit<AutoRagAiSearchRequest, 'stream'> & {
    stream: true;
};
type AutoRagSearchResponse = {
    object: 'vector_store.search_results.page';
    search_query: string;
    data: {
        file_id: string;
        filename: string;
        score: number;
        attributes: Record<string, string | number | boolean | null>;
        content: {
            type: 'text';
            text: string;
        }[];
    }[];
    has_more: boolean;
    next_page: string | null;
};
type AutoRagListResponse = {
    id: string;
    enable: boolean;
    type: string;
    source: string;
    vectorize_name: string;
    paused: boolean;
    status: string;
}[];
type AutoRagAiSearchResponse = AutoRagSearchResponse & {
    response: string;
};
declare abstract class AutoRAG {
    list(): Promise<AutoRagListResponse>;
    search(params: AutoRagSearchRequest): Promise<AutoRagSearchResponse>;
    aiSearch(params: AutoRagAiSearchRequestStreaming): Promise<Response>;
    aiSearch(params: AutoRagAiSearchRequest): Promise<AutoRagAiSearchResponse>;
    aiSearch(params: AutoRagAiSearchRequest): Promise<AutoRagAiSearchResponse | Response>;
}
type BrowserRunLifecycleEvent = 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
type BrowserRunResourceType = 'document' | 'stylesheet' | 'image' | 'media' | 'font' | 'script' | 'texttrack' | 'xhr' | 'fetch' | 'prefetch' | 'eventsource' | 'websocket' | 'manifest' | 'signedexchange' | 'ping' | 'cspviolationreport' | 'preflight' | 'other';
interface BrowserRunBaseOptions {
    addScriptTag?: Array<{
        content?: string;
        url?: string;
        type?: string;
        id?: string;
    }>;
    addStyleTag?: Array<{
        content?: string;
        url?: string;
    }>;
    authenticate?: {
        username: string;
        password: string;
    };
    cookies?: Array<{
        name: string;
        value: string;
        url?: string;
        domain?: string;
        path?: string;
        secure?: boolean;
        httpOnly?: boolean;
        sameSite?: 'Strict' | 'Lax' | 'None';
        expires?: number;
        priority?: 'Low' | 'Medium' | 'High';
        sameParty?: boolean;
        sourceScheme?: 'Unset' | 'NonSecure' | 'Secure';
        sourcePort?: number;
        partitionKey?: string;
    }>;
    emulateMediaType?: string;
    gotoOptions?: {
        timeout?: number;
        waitUntil?: BrowserRunLifecycleEvent | BrowserRunLifecycleEvent[];
        referer?: string;
        referrerPolicy?: string;
    };
    rejectRequestPattern?: string[];
    allowRequestPattern?: string[];
    rejectResourceTypes?: BrowserRunResourceType[];
    allowResourceTypes?: BrowserRunResourceType[];
    setExtraHTTPHeaders?: Record<string, string>;
    setJavaScriptEnabled?: boolean;
    userAgent?: string;
    viewport?: {
        width: number;
        height: number;
        deviceScaleFactor?: number;
        isMobile?: boolean;
        isLandscape?: boolean;
        hasTouch?: boolean;
    };
    waitForSelector?: {
        selector: string;
        hidden?: true;
        visible?: true;
        timeout?: number;
    };
    waitForTimeout?: number;
    bestAttempt?: boolean;
    actionTimeout?: number;
    cacheTTL?: number;
}
type BrowserRunCommonOptions = (BrowserRunBaseOptions & {
    url: string;
}) | (BrowserRunBaseOptions & {
    html: string;
});
type BrowserRunPuppeteerScreenshotOptions = {
    type?: 'png' | 'jpeg' | 'webp';
    encoding?: 'binary' | 'base64';
    quality?: number;
    fullPage?: boolean;
    clip?: {
        x: number;
        y: number;
        width: number;
        height: number;
        scale?: number;
    };
    omitBackground?: boolean;
    optimizeForSpeed?: boolean;
    captureBeyondViewport?: boolean;
    fromSurface?: boolean;
};
type BrowserRunScreenshotOptions = BrowserRunCommonOptions & {
    selector?: string;
    scrollPage?: boolean;
    screenshotOptions?: BrowserRunPuppeteerScreenshotOptions;
};
type BrowserRunPDFOptions = BrowserRunCommonOptions & {
    pdfOptions?: {
        scale?: number;
        displayHeaderFooter?: boolean;
        headerTemplate?: string;
        footerTemplate?: string;
        printBackground?: boolean;
        landscape?: boolean;
        pageRanges?: string;
        format?: 'letter' | 'legal' | 'tabloid' | 'ledger' | 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6';
        width?: string | number;
        height?: string | number;
        preferCSSPageSize?: boolean;
        margin?: {
            top?: string | number;
            right?: string | number;
            bottom?: string | number;
            left?: string | number;
        };
        omitBackground?: boolean;
        tagged?: boolean;
        outline?: boolean;
        timeout?: number;
    };
};
type BrowserRunScrapeOptions = BrowserRunCommonOptions & {
    elements: Array<{
        selector: string;
    }>;
};
type BrowserRunLinksOptions = BrowserRunCommonOptions & {
    visibleLinksOnly?: boolean;
    excludeExternalLinks?: boolean;
};
type BrowserRunSnapshotOptions = BrowserRunCommonOptions & {
    screenshotOptions?: Omit<BrowserRunPuppeteerScreenshotOptions, 'encoding'>;
};
interface BrowserRunJsonBaseOptions {
    custom_ai?: Array<{
        model: string;
        authorization?: string;
    }>;
}
type BrowserRunJsonOptions = BrowserRunCommonOptions & BrowserRunJsonBaseOptions & ({
    prompt: string;
    response_format?: AiTextGenerationResponseFormat;
} | {
    prompt?: string;
    response_format: AiTextGenerationResponseFormat;
});
type BrowserRunContentOptions = BrowserRunCommonOptions;
type BrowserRunMarkdownOptions = BrowserRunCommonOptions;
type BrowserRunResponseMeta = {
    status: number;
    title: string;
};
type BrowserRunContentSuccessResponse = {
    success: true;
    result: string;
    meta: BrowserRunResponseMeta;
};
type BrowserRunLinksSuccessResponse = {
    success: true;
    result: string[];
};
type BrowserRunScrapeSuccessResponse = {
    success: true;
    result: Array<{
        selector: string;
        results: Array<{
            html: string;
            text: string;
            width: number;
            height: number;
            top: number;
            left: number;
            attributes: Array<{
                name: string;
                value: string;
            }>;
        }>;
    }>;
};
type BrowserRunSnapshotSuccessResponse = {
    success: true;
    result: {
        content: string;
        screenshot: string;
    };
    meta: BrowserRunResponseMeta;
};
type BrowserRunJsonSuccessResponse = {
    success: true;
    result: Record<string, unknown>;
};
type BrowserRunMarkdownSuccessResponse = {
    success: true;
    result: string;
};
type BrowserRunErrorResponse = {
    success: false;
    errors: {
        message: string;
        code?: number;
        detail?: string;
        path?: string;
    }[];
};
type BrowserRunJsonErrorResponse = BrowserRunErrorResponse & {
    rawAiResponse?: string;
};
declare abstract class BrowserRun {
    fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
    quickAction(action: 'screenshot', options: BrowserRunScreenshotOptions): Promise<Response>;
    quickAction(action: 'pdf', options: BrowserRunPDFOptions): Promise<Response>;
    quickAction(action: 'content', options: BrowserRunContentOptions): Promise<Response>;
    quickAction(action: 'scrape', options: BrowserRunScrapeOptions): Promise<Response>;
    quickAction(action: 'links', options: BrowserRunLinksOptions): Promise<Response>;
    quickAction(action: 'snapshot', options: BrowserRunSnapshotOptions): Promise<Response>;
    quickAction(action: 'json', options: BrowserRunJsonOptions): Promise<Response>;
    quickAction(action: 'markdown', options: BrowserRunMarkdownOptions): Promise<Response>;
}
interface RequestInitCfProperties extends Record<string, unknown> {
    cacheEverything?: boolean;
    cacheKey?: string;
    cacheTags?: string[];
    cacheTtl?: number;
    cacheTtlByStatus?: Record<string, number>;
    vary?: RequestInitCfPropertiesVary;
    cacheControl?: string;
    cacheReserveEligible?: boolean;
    respectStrongEtag?: boolean;
    stripEtags?: boolean;
    stripLastModified?: boolean;
    cacheDeceptionArmor?: boolean;
    cacheReserveMinimumFileSize?: number;
    scrapeShield?: boolean;
    apps?: boolean;
    grpcWeb?: "passthrough" | "convert";
    image?: RequestInitCfPropertiesImage;
    minify?: RequestInitCfPropertiesImageMinify;
    mirage?: boolean;
    polish?: "lossy" | "lossless" | "off";
    r2?: RequestInitCfPropertiesR2;
    resolveOverride?: string;
}
type RequestInitCfPropertiesVaryAction = "normalize" | "passthrough" | "bypass";
interface RequestInitCfPropertiesVary {
    default: RequestInitCfPropertiesVaryHeader;
    headers?: RequestInitCfPropertiesVaryHeaders;
}
interface RequestInitCfPropertiesVaryHeader {
    action: RequestInitCfPropertiesVaryAction;
}
interface RequestInitCfPropertiesVaryAcceptHeader extends RequestInitCfPropertiesVaryHeader {
    media_types?: string[];
}
interface RequestInitCfPropertiesVaryAcceptLanguageHeader extends RequestInitCfPropertiesVaryHeader {
    languages?: string[];
}
interface RequestInitCfPropertiesVaryHeaders {
    accept?: RequestInitCfPropertiesVaryAcceptHeader;
    "accept-language"?: RequestInitCfPropertiesVaryAcceptLanguageHeader;
    [header: string]: RequestInitCfPropertiesVaryHeader | RequestInitCfPropertiesVaryAcceptHeader | RequestInitCfPropertiesVaryAcceptLanguageHeader | undefined;
}
interface BasicImageTransformations {
    width?: number;
    height?: number;
    gravity?: 'face' | 'left' | 'right' | 'top' | 'bottom' | 'center' | 'auto' | 'entropy' | BasicImageTransformationsGravityCoordinates;
    zoom?: number;
    fit?: "scale-down" | "scale-up" | "contain" | "cover" | "crop" | "pad" | "squeeze";
    trim?: "border" | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
        width?: number;
        height?: number;
        border?: boolean | {
            color?: string;
            tolerance?: number;
            keep?: number;
        };
    };
    background?: string;
    flip?: 'h' | 'v' | 'hv';
    rotate?: 0 | 90 | 180 | 270 | 360;
    sharpen?: number;
    blur?: number;
    contrast?: number;
    brightness?: number;
    gamma?: number;
    saturation?: number;
    dpr?: number;
    border?: {
        color: string;
        width: number;
    } | {
        color: string;
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    segment?: "foreground";
    upscale?: "interpolate" | "generate";
}
interface BasicImageTransformationsGravityCoordinates {
    x?: number;
    y?: number;
    mode?: 'remainder' | 'box-center';
}
interface RequestInitCfPropertiesImageDraw extends BasicImageTransformations {
    url: string;
    opacity?: number;
    repeat?: true | "x" | "y";
    composite?: 
    'over'
     | 'in'
     | 'atop'
     | 'out'
     | 'xor'
     | 'lighter';
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
}
interface RequestInitCfPropertiesImage extends BasicImageTransformations {
    quality?: number | "low" | "medium-low" | "medium-high" | "high";
    format?: "avif" | "webp" | "json" | "jpeg" | "png" | "baseline-jpeg" | "png-force" | "svg";
    anim?: boolean;
    metadata?: "keep" | "copyright" | "none";
    draw?: RequestInitCfPropertiesImageDraw[];
    "origin-auth"?: "share-publicly";
    compression?: "fast";
}
interface RequestInitCfPropertiesImageMinify {
    javascript?: boolean;
    css?: boolean;
    html?: boolean;
}
interface RequestInitCfPropertiesR2 {
    bucketColoId?: number;
}
type IncomingRequestCfProperties<HostMetadata = unknown> = IncomingRequestCfPropertiesBase & IncomingRequestCfPropertiesBotManagementEnterprise & IncomingRequestCfPropertiesCloudflareForSaaSEnterprise<HostMetadata> & IncomingRequestCfPropertiesGeographicInformation & IncomingRequestCfPropertiesCloudflareAccessOrApiShield;
interface IncomingRequestCfPropertiesBase extends Record<string, unknown> {
    asn?: number;
    asOrganization?: string;
    clientAcceptEncoding?: string;
    clientTcpRtt?: number;
    colo: string;
    edgeRequestKeepAliveStatus: IncomingRequestCfPropertiesEdgeRequestKeepAliveStatus;
    httpProtocol: string;
    requestPriority: string;
    tlsVersion: string;
    tlsCipher: string;
    tlsExportedAuthenticator?: IncomingRequestCfPropertiesExportedAuthenticatorMetadata;
}
interface IncomingRequestCfPropertiesBotManagementBase {
    score: number;
    verifiedBot: boolean;
    corporateProxy: boolean;
    staticResource: boolean;
    detectionIds: number[];
}
interface IncomingRequestCfPropertiesBotManagement {
    botManagement: IncomingRequestCfPropertiesBotManagementBase;
    clientTrustScore: number;
}
interface IncomingRequestCfPropertiesBotManagementEnterprise extends IncomingRequestCfPropertiesBotManagement {
    botManagement: IncomingRequestCfPropertiesBotManagementBase & {
        ja3Hash: string;
    };
}
interface IncomingRequestCfPropertiesCloudflareForSaaSEnterprise<HostMetadata> {
    hostMetadata?: HostMetadata;
}
interface IncomingRequestCfPropertiesCloudflareAccessOrApiShield {
    tlsClientAuth: IncomingRequestCfPropertiesTLSClientAuth | IncomingRequestCfPropertiesTLSClientAuthPlaceholder;
}
interface IncomingRequestCfPropertiesExportedAuthenticatorMetadata {
    clientHandshake: string;
    serverHandshake: string;
    clientFinished: string;
    serverFinished: string;
}
interface IncomingRequestCfPropertiesGeographicInformation {
    country?: Iso3166Alpha2Code | "T1";
    isEUCountry?: "1";
    continent?: ContinentCode;
    city?: string;
    postalCode?: string;
    latitude?: string;
    longitude?: string;
    timezone?: string;
    region?: string;
    regionCode?: string;
    metroCode?: string;
}
interface IncomingRequestCfPropertiesTLSClientAuth {
    certPresented: "1";
    certVerified: Exclude<CertVerificationStatus, "NONE">;
    certRevoked: "1" | "0";
    certIssuerDN: string;
    certSubjectDN: string;
    certIssuerDNRFC2253: string;
    certSubjectDNRFC2253: string;
    certIssuerDNLegacy: string;
    certSubjectDNLegacy: string;
    certSerial: string;
    certIssuerSerial: string;
    certSKI: string;
    certIssuerSKI: string;
    certFingerprintSHA1: string;
    certFingerprintSHA256: string;
    certNotBefore: string;
    certNotAfter: string;
    certRFC9440: string;
    certRFC9440TooLarge: boolean;
    certChainRFC9440: string;
    certChainRFC9440TooLarge: boolean;
}
interface IncomingRequestCfPropertiesTLSClientAuthPlaceholder {
    certPresented: "0";
    certVerified: "NONE";
    certRevoked: "0";
    certIssuerDN: "";
    certSubjectDN: "";
    certIssuerDNRFC2253: "";
    certSubjectDNRFC2253: "";
    certIssuerDNLegacy: "";
    certSubjectDNLegacy: "";
    certSerial: "";
    certIssuerSerial: "";
    certSKI: "";
    certIssuerSKI: "";
    certFingerprintSHA1: "";
    certFingerprintSHA256: "";
    certNotBefore: "";
    certNotAfter: "";
    certRFC9440: "";
    certRFC9440TooLarge: false;
    certChainRFC9440: "";
    certChainRFC9440TooLarge: false;
}
declare type CertVerificationStatus = 
"SUCCESS"
 | "NONE"
 | "FAILED:self signed certificate"
 | "FAILED:unable to verify the first certificate"
 | "FAILED:certificate is not yet valid"
 | "FAILED:certificate has expired"
 | "FAILED";
declare type IncomingRequestCfPropertiesEdgeRequestKeepAliveStatus = 0   | 1   | 2   | 3   | 4   | 5;
declare type Iso3166Alpha2Code = "AD" | "AE" | "AF" | "AG" | "AI" | "AL" | "AM" | "AO" | "AQ" | "AR" | "AS" | "AT" | "AU" | "AW" | "AX" | "AZ" | "BA" | "BB" | "BD" | "BE" | "BF" | "BG" | "BH" | "BI" | "BJ" | "BL" | "BM" | "BN" | "BO" | "BQ" | "BR" | "BS" | "BT" | "BV" | "BW" | "BY" | "BZ" | "CA" | "CC" | "CD" | "CF" | "CG" | "CH" | "CI" | "CK" | "CL" | "CM" | "CN" | "CO" | "CR" | "CU" | "CV" | "CW" | "CX" | "CY" | "CZ" | "DE" | "DJ" | "DK" | "DM" | "DO" | "DZ" | "EC" | "EE" | "EG" | "EH" | "ER" | "ES" | "ET" | "FI" | "FJ" | "FK" | "FM" | "FO" | "FR" | "GA" | "GB" | "GD" | "GE" | "GF" | "GG" | "GH" | "GI" | "GL" | "GM" | "GN" | "GP" | "GQ" | "GR" | "GS" | "GT" | "GU" | "GW" | "GY" | "HK" | "HM" | "HN" | "HR" | "HT" | "HU" | "ID" | "IE" | "IL" | "IM" | "IN" | "IO" | "IQ" | "IR" | "IS" | "IT" | "JE" | "JM" | "JO" | "JP" | "KE" | "KG" | "KH" | "KI" | "KM" | "KN" | "KP" | "KR" | "KW" | "KY" | "KZ" | "LA" | "LB" | "LC" | "LI" | "LK" | "LR" | "LS" | "LT" | "LU" | "LV" | "LY" | "MA" | "MC" | "MD" | "ME" | "MF" | "MG" | "MH" | "MK" | "ML" | "MM" | "MN" | "MO" | "MP" | "MQ" | "MR" | "MS" | "MT" | "MU" | "MV" | "MW" | "MX" | "MY" | "MZ" | "NA" | "NC" | "NE" | "NF" | "NG" | "NI" | "NL" | "NO" | "NP" | "NR" | "NU" | "NZ" | "OM" | "PA" | "PE" | "PF" | "PG" | "PH" | "PK" | "PL" | "PM" | "PN" | "PR" | "PS" | "PT" | "PW" | "PY" | "QA" | "RE" | "RO" | "RS" | "RU" | "RW" | "SA" | "SB" | "SC" | "SD" | "SE" | "SG" | "SH" | "SI" | "SJ" | "SK" | "SL" | "SM" | "SN" | "SO" | "SR" | "SS" | "ST" | "SV" | "SX" | "SY" | "SZ" | "TC" | "TD" | "TF" | "TG" | "TH" | "TJ" | "TK" | "TL" | "TM" | "TN" | "TO" | "TR" | "TT" | "TV" | "TW" | "TZ" | "UA" | "UG" | "UM" | "US" | "UY" | "UZ" | "VA" | "VC" | "VE" | "VG" | "VI" | "VN" | "VU" | "WF" | "WS" | "YE" | "YT" | "ZA" | "ZM" | "ZW";
declare type ContinentCode = "AF" | "AN" | "AS" | "EU" | "NA" | "OC" | "SA";
type CfProperties<HostMetadata = unknown> = IncomingRequestCfProperties<HostMetadata> | RequestInitCfProperties;
interface D1Meta {
    duration: number;
    size_after: number;
    rows_read: number;
    rows_written: number;
    last_row_id: number;
    changed_db: boolean;
    changes: number;
    served_by_region?: string;
    served_by_colo?: string;
    served_by_primary?: boolean;
    timings?: {
        sql_duration_ms: number;
    };
    total_attempts?: number;
}
interface D1Response {
    success: true;
    meta: D1Meta & Record<string, unknown>;
    error?: never;
}
type D1Result<T = unknown> = D1Response & {
    results: T[];
};
interface D1ExecResult {
    count: number;
    duration: number;
}
type D1SessionConstraint = 
'first-primary'
 | 'first-unconstrained';
type D1SessionBookmark = string;
declare abstract class D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    exec(query: string): Promise<D1ExecResult>;
    withSession(constraintOrBookmark?: D1SessionBookmark | D1SessionConstraint): D1DatabaseSession;
    dump(): Promise<ArrayBuffer>;
}
declare abstract class D1DatabaseSession {
    prepare(query: string): D1PreparedStatement;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    getBookmark(): D1SessionBookmark | null;
}
declare abstract class D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(colName: string): Promise<T | null>;
    first<T = Record<string, unknown>>(): Promise<T | null>;
    run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
    all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
    raw<T = unknown[]>(options: {
        columnNames: true;
    }): Promise<[
        string[],
        ...T[]
    ]>;
    raw<T = unknown[]>(options?: {
        columnNames?: false;
    }): Promise<T[]>;
}
interface Disposable {
}
interface EmailSendResult {
    messageId: string;
}
interface EmailMessage {
    readonly from: string;
    readonly to: string;
}
interface ForwardableEmailMessage extends EmailMessage {
    readonly raw: ReadableStream<Uint8Array>;
    readonly headers: Headers;
    readonly rawSize: number;
    setReject(reason: string): void;
    forward(rcptTo: string, headers?: Headers): Promise<EmailSendResult>;
    reply(message: EmailMessage): Promise<EmailSendResult>;
    reply(builder: EmailReplyMessageBuilder): Promise<EmailSendResult>;
}
type EmailAttachment = {
    disposition: 'inline';
    contentId: string;
    filename: string;
    type: string;
    content: string | ArrayBuffer | ArrayBufferView;
} | {
    disposition: 'attachment';
    contentId?: undefined;
    filename: string;
    type: string;
    content: string | ArrayBuffer | ArrayBufferView;
};
interface EmailAddress {
    name: string;
    email: string;
}
type EmailDestinations = {
    to?: string | EmailAddress | (string | EmailAddress)[];
    cc?: string | EmailAddress | (string | EmailAddress)[];
    bcc?: string | EmailAddress | (string | EmailAddress)[];
} & ({
    to: string | EmailAddress | (string | EmailAddress)[];
} | {
    cc: string | EmailAddress | (string | EmailAddress)[];
} | {
    bcc: string | EmailAddress | (string | EmailAddress)[];
});
interface EmailReplyMessageBuilder {
    from: string | EmailAddress;
    subject: string;
    replyTo?: string | EmailAddress;
    headers?: Record<string, string>;
    text?: string;
    html?: string;
    attachments?: EmailAttachment[];
}
type EmailMessageBuilder = EmailReplyMessageBuilder & EmailDestinations;
interface SendEmail {
    send(message: EmailMessage): Promise<EmailSendResult>;
    send(builder: EmailMessageBuilder): Promise<EmailSendResult>;
}
declare abstract class EmailEvent extends ExtendableEvent {
    readonly message: ForwardableEmailMessage;
}
declare type EmailExportedHandler<Env = unknown, Props = unknown> = (message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext<Props>) => void | Promise<void>;
declare module "cloudflare:email" {
    let _EmailMessage: {
        prototype: EmailMessage;
        new (from: string, to: string, raw: ReadableStream | string): EmailMessage;
    };
    export { _EmailMessage as EmailMessage };
}
type FlagshipEvaluationContext = Record<string, string | number | boolean>;
interface FlagshipEvaluationDetails<T> {
    flagKey: string;
    value: T;
    variant?: string | undefined;
    reason?: string | undefined;
    errorCode?: string | undefined;
    errorMessage?: string | undefined;
}
interface FlagshipEvaluationError extends Error {
}
declare abstract class Flagship {
    get(flagKey: string, defaultValue?: unknown, context?: FlagshipEvaluationContext): Promise<unknown>;
    getBooleanValue(flagKey: string, defaultValue: boolean, context?: FlagshipEvaluationContext): Promise<boolean>;
    getStringValue(flagKey: string, defaultValue: string, context?: FlagshipEvaluationContext): Promise<string>;
    getNumberValue(flagKey: string, defaultValue: number, context?: FlagshipEvaluationContext): Promise<number>;
    getObjectValue<T extends object>(flagKey: string, defaultValue: T, context?: FlagshipEvaluationContext): Promise<T>;
    getBooleanDetails(flagKey: string, defaultValue: boolean, context?: FlagshipEvaluationContext): Promise<FlagshipEvaluationDetails<boolean>>;
    getStringDetails(flagKey: string, defaultValue: string, context?: FlagshipEvaluationContext): Promise<FlagshipEvaluationDetails<string>>;
    getNumberDetails(flagKey: string, defaultValue: number, context?: FlagshipEvaluationContext): Promise<FlagshipEvaluationDetails<number>>;
    getObjectDetails<T extends object>(flagKey: string, defaultValue: T, context?: FlagshipEvaluationContext): Promise<FlagshipEvaluationDetails<T>>;
}
interface HelloWorldBinding {
    get(): Promise<{
        value: string;
        ms?: number;
    }>;
    set(value: string): Promise<void>;
}
interface Hyperdrive {
    connect(): Socket;
    readonly connectionString: string;
    readonly host: string;
    readonly port: number;
    readonly user: string;
    readonly password: string;
    readonly database: string;
}
type ImageInfoResponse = {
    format: 'image/svg+xml';
} | {
    format: string;
    fileSize: number;
    width: number;
    height: number;
};
type ImageTransform = {
    width?: number;
    height?: number;
    background?: string;
    blur?: number;
    border?: {
        color?: string;
        width?: number;
    } | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
    brightness?: number;
    contrast?: number;
    fit?: 'scale-down' | 'contain' | 'pad' | 'squeeze' | 'cover' | 'crop';
    flip?: 'h' | 'v' | 'hv';
    gamma?: number;
    segment?: 'foreground';
    gravity?: 'face' | 'left' | 'right' | 'top' | 'bottom' | 'center' | 'auto' | 'entropy' | {
        x?: number;
        y?: number;
        mode: 'remainder' | 'box-center';
    };
    rotate?: 0 | 90 | 180 | 270;
    saturation?: number;
    sharpen?: number;
    trim?: 'border' | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
        width?: number;
        height?: number;
        border?: boolean | {
            color?: string;
            tolerance?: number;
            keep?: number;
        };
    };
};
type ImageDrawOptions = {
    opacity?: number;
    repeat?: boolean | string;
    composite?: ImageCompositeMode;
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
};
type ImageCompositeMode = 
'over'
 | 'in'
 | 'atop'
 | 'out'
 | 'xor'
 | 'lighter';
type ImageInputOptions = {
    encoding?: 'base64';
};
type ImageOutputOptions = {
    format: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | 'image/avif' | 'rgb' | 'rgba';
    quality?: number;
    background?: string;
    anim?: boolean;
};
interface ImageMetadata {
    id: string;
    filename?: string;
    uploaded?: string;
    requireSignedURLs: boolean;
    meta?: Record<string, unknown>;
    variants: string[];
    draft?: boolean;
    creator?: string;
}
interface ImageUploadOptions {
    id?: string;
    filename?: string;
    requireSignedURLs?: boolean;
    metadata?: Record<string, unknown>;
    creator?: string;
    encoding?: 'base64';
}
interface ImageUpdateOptions {
    requireSignedURLs?: boolean;
    metadata?: Record<string, unknown>;
    creator?: string;
}
interface ImageListOptions {
    limit?: number;
    cursor?: string;
    sortOrder?: 'asc' | 'desc';
    creator?: string;
}
interface ImageList {
    images: ImageMetadata[];
    cursor?: string;
    listComplete: boolean;
}
interface ImageHandle {
    details(): Promise<ImageMetadata | null>;
    bytes(): Promise<ReadableStream<Uint8Array> | null>;
    update(options: ImageUpdateOptions): Promise<ImageMetadata>;
    delete(): Promise<boolean>;
}
interface HostedImagesBinding {
    image(imageId: string): ImageHandle;
    upload(image: ReadableStream<Uint8Array> | ArrayBuffer, options?: ImageUploadOptions): Promise<ImageMetadata>;
    list(options?: ImageListOptions): Promise<ImageList>;
}
interface ImagesBinding {
    info(stream: ReadableStream<Uint8Array>, options?: ImageInputOptions): Promise<ImageInfoResponse>;
    input(stream: ReadableStream<Uint8Array>, options?: ImageInputOptions): ImageTransformer;
    readonly hosted: HostedImagesBinding;
}
interface ImageTransformer {
    transform(transform: ImageTransform): ImageTransformer;
    draw(image: ReadableStream<Uint8Array> | ImageTransformer, options?: ImageDrawOptions): ImageTransformer;
    output(options: ImageOutputOptions): Promise<ImageTransformationResult>;
}
type ImageTransformationOutputOptions = {
    encoding?: 'base64';
};
interface ImageTransformationResult {
    response(): Response;
    contentType(): string;
    image(options?: ImageTransformationOutputOptions): ReadableStream<Uint8Array>;
}
interface ImagesError extends Error {
    readonly code: number;
    readonly message: string;
    readonly stack?: string;
}
interface MediaBinding {
    input(media: ReadableStream<Uint8Array>): MediaTransformer;
}
interface MediaTransformer {
    transform(transform?: MediaTransformationInputOptions): MediaTransformationGenerator;
    output(output?: MediaTransformationOutputOptions): MediaTransformationResult;
}
interface MediaTransformationGenerator {
    output(output?: MediaTransformationOutputOptions): MediaTransformationResult;
}
interface MediaTransformationResult {
    media(): Promise<ReadableStream<Uint8Array>>;
    response(): Promise<Response>;
    contentType(): Promise<string>;
}
type MediaTransformationInputOptions = {
    fit?: 'contain' | 'cover' | 'scale-down';
    width?: number;
    height?: number;
};
type MediaTransformationOutputOptions = {
    mode?: 'video' | 'spritesheet' | 'frame' | 'audio';
    audio?: boolean;
    time?: string;
    duration?: string;
    imageCount?: number;
    format?: 'jpg' | 'png' | 'm4a';
};
interface MediaError extends Error {
    readonly code: number;
    readonly message: string;
    readonly stack?: string;
}
declare module 'cloudflare:node' {
    interface NodeStyleServer {
        listen(...args: unknown[]): this;
        address(): {
            port?: number | null | undefined;
        };
    }
    export function httpServerHandler(port: number): ExportedHandler;
    export function httpServerHandler(options: {
        port: number;
    }): ExportedHandler;
    export function httpServerHandler(server: NodeStyleServer): ExportedHandler;
}
type Params<P extends string = any> = Record<P, string | string[]>;
type EventContext<Env, P extends string, Data> = {
    request: Request<unknown, IncomingRequestCfProperties<unknown>>;
    functionPath: string;
    waitUntil: (promise: Promise<any>) => void;
    passThroughOnException: () => void;
    next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
    env: Env & {
        ASSETS: {
            fetch: typeof fetch;
        };
    };
    params: Params<P>;
    data: Data;
};
type PagesFunction<Env = unknown, Params extends string = any, Data extends Record<string, unknown> = Record<string, unknown>> = (context: EventContext<Env, Params, Data>) => Response | Promise<Response>;
type EventPluginContext<Env, P extends string, Data, PluginArgs> = {
    request: Request<unknown, IncomingRequestCfProperties<unknown>>;
    functionPath: string;
    waitUntil: (promise: Promise<any>) => void;
    passThroughOnException: () => void;
    next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
    env: Env & {
        ASSETS: {
            fetch: typeof fetch;
        };
    };
    params: Params<P>;
    data: Data;
    pluginArgs: PluginArgs;
};
type PagesPluginFunction<Env = unknown, Params extends string = any, Data extends Record<string, unknown> = Record<string, unknown>, PluginArgs = unknown> = (context: EventPluginContext<Env, Params, Data, PluginArgs>) => Response | Promise<Response>;
declare module "assets:*" {
    export const onRequest: PagesFunction;
}
declare module "cloudflare:pipelines" {
    export abstract class PipelineTransformationEntrypoint<Env = unknown, I extends PipelineRecord = PipelineRecord, O extends PipelineRecord = PipelineRecord> {
        protected env: Env;
        protected ctx: ExecutionContext;
        constructor(ctx: ExecutionContext, env: Env);
        public run(records: I[], metadata: PipelineBatchMetadata): Promise<O[]>;
    }
    export type PipelineRecord = Record<string, unknown>;
    export type PipelineBatchMetadata = {
        pipelineId: string;
        pipelineName: string;
    };
    export interface Pipeline<T extends PipelineRecord = PipelineRecord> {
        send(records: T[]): Promise<void>;
    }
}
interface PubSubMessage {
    readonly mid: number;
    readonly broker: string;
    readonly topic: string;
    readonly clientId: string;
    readonly jti?: string;
    readonly receivedAt: number;
    readonly contentType: string;
    readonly payloadFormatIndicator: number;
    payload: string | Uint8Array;
}
interface JsonWebKeyWithKid extends JsonWebKey {
    readonly kid: string;
}
interface RateLimitOptions {
    key: string;
}
interface RateLimitOutcome {
    success: boolean;
}
interface RateLimit {
    limit(options: RateLimitOptions): Promise<RateLimitOutcome>;
}
declare namespace Rpc {
    export const __RPC_STUB_BRAND: '__RPC_STUB_BRAND';
    export const __RPC_TARGET_BRAND: '__RPC_TARGET_BRAND';
    export const __WORKER_ENTRYPOINT_BRAND: '__WORKER_ENTRYPOINT_BRAND';
    export const __DURABLE_OBJECT_BRAND: '__DURABLE_OBJECT_BRAND';
    export const __WORKFLOW_ENTRYPOINT_BRAND: '__WORKFLOW_ENTRYPOINT_BRAND';
    export interface RpcTargetBranded {
        [__RPC_TARGET_BRAND]: never;
    }
    export interface WorkerEntrypointBranded {
        [__WORKER_ENTRYPOINT_BRAND]: never;
    }
    export interface DurableObjectBranded {
        [__DURABLE_OBJECT_BRAND]: never;
    }
    export interface WorkflowEntrypointBranded {
        [__WORKFLOW_ENTRYPOINT_BRAND]: never;
    }
    export type EntrypointBranded = WorkerEntrypointBranded | DurableObjectBranded | WorkflowEntrypointBranded;
    export type Stubable = RpcTargetBranded | ((...args: any[]) => any);
    type Serializable<T> = 
    BaseType
     | Map<T extends Map<infer U, unknown> ? Serializable<U> : never, T extends Map<unknown, infer U> ? Serializable<U> : never> | Set<T extends Set<infer U> ? Serializable<U> : never> | ReadonlyArray<T extends ReadonlyArray<infer U> ? Serializable<U> : never> | {
        [K in keyof T]: K extends number | string ? Serializable<T[K]> : never;
    }
     | Stub<Stubable>
     | Stubable;
    interface StubBase<T extends Stubable> extends Disposable {
        [__RPC_STUB_BRAND]: T;
        dup(): this;
    }
    export type Stub<T extends Stubable> = Provider<T> & StubBase<T>;
    type BaseType = void | undefined | null | boolean | number | bigint | string | TypedArray | ArrayBuffer | DataView | Date | Error | RegExp | ReadableStream<Uint8Array> | WritableStream<Uint8Array> | Request | Response | Headers;
    type Stubify<T> = T extends Stubable ? Stub<T> : T extends Map<infer K, infer V> ? Map<Stubify<K>, Stubify<V>> : T extends Set<infer V> ? Set<Stubify<V>> : T extends Array<infer V> ? Array<Stubify<V>> : T extends ReadonlyArray<infer V> ? ReadonlyArray<Stubify<V>> : T extends BaseType ? T : T extends {
        [key: string | number]: any;
    } ? {
        [K in keyof T]: Stubify<T[K]>;
    } : T;
    type Unstubify<T> = T extends StubBase<infer V> ? V : T extends Map<infer K, infer V> ? Map<Unstubify<K>, Unstubify<V>> : T extends Set<infer V> ? Set<Unstubify<V>> : T extends Array<infer V> ? Array<Unstubify<V>> : T extends ReadonlyArray<infer V> ? ReadonlyArray<Unstubify<V>> : T extends BaseType ? T : T extends {
        [key: string | number]: unknown;
    } ? {
        [K in keyof T]: Unstubify<T[K]>;
    } : T;
    type UnstubifyAll<A extends any[]> = {
        [I in keyof A]: Unstubify<A[I]>;
    };
    type MaybeProvider<T> = T extends object ? Provider<T> : unknown;
    type MaybeDisposable<T> = T extends object ? Disposable : unknown;
    type Result<R> = R extends Stubable ? Promise<Stub<R>> & Provider<R> : R extends Serializable<R> ? Promise<Stubify<R> & MaybeDisposable<R>> & MaybeProvider<R> : never;
    type MethodOrProperty<V> = V extends (...args: infer P) => infer R ? (...args: UnstubifyAll<P>) => Result<Awaited<R>> : Result<Awaited<V>>;
    type MaybeCallableProvider<T> = T extends (...args: any[]) => any ? MethodOrProperty<T> : unknown;
    export type Provider<T extends object, Reserved extends string = never> = MaybeCallableProvider<T> & Pick<{
        [K in keyof T]: MethodOrProperty<T[K]>;
    }, Exclude<keyof T, Reserved | symbol | keyof StubBase<never>>>;
}
declare namespace Cloudflare {
    interface Env {
    }
    interface GlobalProps {
    }
    type GlobalProp<K extends string, Default> = K extends keyof GlobalProps ? GlobalProps[K] : Default;
    type MainModule = GlobalProp<"mainModule", {}>;
    type Exports = {
        [K in keyof MainModule]: LoopbackForExport<MainModule[K]>
         & (K extends GlobalProp<"durableNamespaces", never> ? MainModule[K] extends new (...args: any[]) => infer DoInstance ? DoInstance extends Rpc.DurableObjectBranded ? DurableObjectNamespace<DoInstance> : DurableObjectNamespace<undefined> : DurableObjectNamespace<undefined> : {});
    };
}
declare namespace CloudflareWorkersModule {
    export type RpcStub<T extends Rpc.Stubable> = Rpc.Stub<T>;
    export const RpcStub: {
        new <T extends Rpc.Stubable>(value: T): Rpc.Stub<T>;
    };
    export abstract class RpcTarget implements Rpc.RpcTargetBranded {
        [Rpc.__RPC_TARGET_BRAND]: never;
    }
    export abstract class WorkerEntrypoint<Env = Cloudflare.Env, Props = {}> implements Rpc.WorkerEntrypointBranded {
        [Rpc.__WORKER_ENTRYPOINT_BRAND]: never;
        protected ctx: ExecutionContext<Props>;
        protected env: Env;
        constructor(ctx: ExecutionContext, env: Env);
        email?(message: ForwardableEmailMessage): void | Promise<void>;
        fetch?(request: Request): Response | Promise<Response>;
        connect?(socket: Socket): void | Promise<void>;
        queue?(batch: MessageBatch): void | Promise<void>;
        scheduled?(controller: ScheduledController): void | Promise<void>;
        tail?(events: TraceItem[]): void | Promise<void>;
        tailStream?(event: TailStream.TailEvent<TailStream.Onset>): TailStream.TailEventHandlerType | Promise<TailStream.TailEventHandlerType>;
        test?(controller: TestController): void | Promise<void>;
        trace?(traces: TraceItem[]): void | Promise<void>;
    }
    export abstract class DurableObject<Env = Cloudflare.Env, Props = {}> implements Rpc.DurableObjectBranded {
        [Rpc.__DURABLE_OBJECT_BRAND]: never;
        protected ctx: DurableObjectState<Props>;
        protected env: Env;
        constructor(ctx: DurableObjectState, env: Env);
        alarm?(alarmInfo?: AlarmInvocationInfo): void | Promise<void>;
        fetch?(request: Request): Response | Promise<Response>;
        connect?(socket: Socket): void | Promise<void>;
        webSocketMessage?(ws: WebSocket, message: string | ArrayBuffer): void | Promise<void>;
        webSocketClose?(ws: WebSocket, code: number, reason: string, wasClean: boolean): void | Promise<void>;
        webSocketError?(ws: WebSocket, error: unknown): void | Promise<void>;
    }
    export type WorkflowDurationLabel = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
    export type WorkflowSleepDuration = `${number} ${WorkflowDurationLabel}${'s' | ''}` | number;
    export type WorkflowDelayDuration = WorkflowSleepDuration;
    export type WorkflowDynamicDelayContext = {
        ctx: WorkflowStepContext<WorkflowDelayFunction>;
        error: Error;
    };
    export type WorkflowDelayFunction = (input: WorkflowDynamicDelayContext) => WorkflowDelayDuration | Promise<WorkflowDelayDuration>;
    export type WorkflowTimeoutDuration = WorkflowSleepDuration;
    export type WorkflowRetentionDuration = WorkflowSleepDuration;
    export type WorkflowBackoff = 'constant' | 'linear' | 'exponential';
    export type WorkflowStepSensitivity = 'output';
    export type WorkflowStepConfig = {
        retries?: {
            limit: number;
            delay: WorkflowDelayDuration | number | WorkflowDelayFunction;
            backoff?: WorkflowBackoff;
        };
        timeout?: WorkflowTimeoutDuration | number;
        sensitive?: WorkflowStepSensitivity;
    };
    export type WorkflowStepRollbackConfig = Pick<WorkflowStepConfig, 'retries' | 'timeout'>;
    export type WorkflowCronSchedule = {
        cron: string;
        scheduledTime: number;
    };
    export type WorkflowEvent<T> = {
        payload: Readonly<T>;
        timestamp: Date;
        instanceId: string;
        workflowName: string;
        schedule?: WorkflowCronSchedule;
    };
    export type WorkflowStepEvent<T> = {
        payload: Readonly<T>;
        timestamp: Date;
        type: string;
        sensitive?: WorkflowStepSensitivity;
    };
    export type WorkflowStepContext<Delay = WorkflowDelayDuration | number> = {
        step: {
            name: string;
            count: number;
        };
        attempt: number;
        config: {
            retries?: {
                limit: number;
                backoff?: WorkflowBackoff;
            } & (Delay extends WorkflowDelayFunction ? {} : {
                delay: WorkflowDelayDuration | number;
            });
            timeout?: WorkflowTimeoutDuration | number;
            sensitive?: WorkflowStepSensitivity;
        };
    };
    export type WorkflowRollbackContext<T = unknown> = {
        ctx: WorkflowStepContext;
        error: Error;
        output: T | undefined;
        stepName: string;
    };
    export type WorkflowRollbackHandler<T = unknown> = (ctx: WorkflowRollbackContext<T>) => Promise<void>;
    export type WorkflowStepRollbackOptions<T = unknown> = {
        rollback: WorkflowRollbackHandler<T>;
        rollbackConfig?: WorkflowStepRollbackConfig;
    };
    export abstract class WorkflowStep {
        do<T extends Rpc.Serializable<T>>(name: string, callback: (ctx: WorkflowStepContext) => Promise<T>, rollbackOptions?: WorkflowStepRollbackOptions<T>): Promise<T>;
        do<T extends Rpc.Serializable<T>, const C extends WorkflowStepConfig>(name: string, config: C, callback: (ctx: WorkflowStepContext<C['retries'] extends {
            delay: infer D;
        } ? D : WorkflowDelayDuration | number>) => Promise<T>, rollbackOptions?: WorkflowStepRollbackOptions<T>): Promise<T>;
        sleep: (name: string, duration: WorkflowSleepDuration) => Promise<void>;
        sleepUntil: (name: string, timestamp: Date | number) => Promise<void>;
        waitForEvent<T extends Rpc.Serializable<T>>(name: string, options: {
            type: string;
            timeout?: WorkflowTimeoutDuration | number;
        }): Promise<WorkflowStepEvent<T>>;
    }
    export type WorkflowInstanceStatus = 'queued' | 'running' | 'paused' | 'errored' | 'terminated' | 'complete' | 'waiting' | 'waitingForPause' | 'unknown';
    export abstract class WorkflowEntrypoint<Env = unknown, T extends Rpc.Serializable<T> | unknown = unknown> implements Rpc.WorkflowEntrypointBranded {
        [Rpc.__WORKFLOW_ENTRYPOINT_BRAND]: never;
        protected ctx: ExecutionContext;
        protected env: Env;
        constructor(ctx: ExecutionContext, env: Env);
        run(event: Readonly<WorkflowEvent<T>>, step: WorkflowStep): Promise<unknown>;
    }
    export function waitUntil(promise: Promise<unknown>): void;
    export function withEnv(newEnv: unknown, fn: () => unknown): unknown;
    export function withExports(newExports: unknown, fn: () => unknown): unknown;
    export function withEnvAndExports(newEnv: unknown, newExports: unknown, fn: () => unknown): unknown;
    export const env: Cloudflare.Env;
    export const exports: Cloudflare.Exports;
    export const cache: CacheContext;
    export const tracing: Tracing;
}
declare module 'cloudflare:workers' {
    export = CloudflareWorkersModule;
}
interface SecretsStoreSecret {
    get(): Promise<string>;
}
declare module "cloudflare:sockets" {
    function _connect(address: string | SocketAddress, options?: SocketOptions): Socket;
    export { _connect as connect };
}
interface StreamBinding {
    video(id: string): StreamVideoHandle;
    upload(url: string, params?: StreamUrlUploadParams): Promise<StreamVideo>;
    createDirectUpload(params: StreamDirectUploadCreateParams): Promise<StreamDirectUpload>;
    videos: StreamVideos;
    watermarks: StreamWatermarks;
}
interface StreamVideoHandle {
    id: string;
    details(): Promise<StreamVideo>;
    update(params: StreamUpdateVideoParams): Promise<StreamVideo>;
    delete(): Promise<void>;
    generateToken(): Promise<string>;
    downloads: StreamScopedDownloads;
    captions: StreamScopedCaptions;
}
interface StreamVideo {
    id: string;
    creator: string | null;
    thumbnail: string;
    thumbnailTimestampPct: number;
    readyToStream: boolean;
    readyToStreamAt: string | null;
    status: StreamVideoStatus;
    meta: Record<string, string>;
    created: string;
    modified: string;
    scheduledDeletion: string | null;
    size: number;
    preview?: string;
    allowedOrigins: Array<string>;
    requireSignedURLs: boolean | null;
    uploaded: string | null;
    uploadExpiry: string | null;
    maxSizeBytes: number | null;
    maxDurationSeconds: number | null;
    duration: number;
    input: StreamVideoInput;
    hlsPlaybackUrl: string;
    dashPlaybackUrl: string;
    watermark: StreamWatermark | null;
    liveInputId?: string | null;
    clippedFromId: string | null;
    publicDetails: StreamPublicDetails | null;
}
type StreamVideoStatus = {
    state: string;
    step?: string;
    pctComplete?: string;
    errorReasonCode: string;
    errorReasonText: string;
};
type StreamVideoInput = {
    width: number;
    height: number;
};
type StreamPublicDetails = {
    title: string | null;
    share_link: string | null;
    channel_link: string | null;
    logo: string | null;
};
type StreamDirectUpload = {
    uploadURL: string;
    id: string;
    watermark: StreamWatermark | null;
    scheduledDeletion: string | null;
};
type StreamDirectUploadCreateParams = {
    maxDurationSeconds: number;
    expiry?: string;
    creator?: string;
    meta?: Record<string, string>;
    allowedOrigins?: Array<string>;
    requireSignedURLs?: boolean;
    thumbnailTimestampPct?: number;
    scheduledDeletion?: string | null;
    watermark?: StreamDirectUploadWatermark;
};
type StreamDirectUploadWatermark = {
    id: string;
};
type StreamUrlUploadParams = {
    allowedOrigins?: Array<string>;
    creator?: string;
    meta?: Record<string, string>;
    requireSignedURLs?: boolean;
    scheduledDeletion?: string | null;
    thumbnailTimestampPct?: number;
    watermarkId?: string;
};
interface StreamScopedCaptions {
    upload(language: string, input: ReadableStream): Promise<StreamCaption>;
    generate(language: string): Promise<StreamCaption>;
    list(language?: string): Promise<StreamCaption[]>;
    delete(language: string): Promise<void>;
}
interface StreamScopedDownloads {
    generate(downloadType?: StreamDownloadType): Promise<StreamDownloadGetResponse>;
    get(): Promise<StreamDownloadGetResponse>;
    delete(downloadType?: StreamDownloadType): Promise<void>;
}
interface StreamVideos {
    list(params?: StreamVideosListParams): Promise<StreamVideo[]>;
}
interface StreamWatermarks {
    generate(input: ReadableStream, params: StreamWatermarkCreateParams): Promise<StreamWatermark>;
    generate(url: string, params: StreamWatermarkCreateParams): Promise<StreamWatermark>;
    list(): Promise<StreamWatermark[]>;
    get(watermarkId: string): Promise<StreamWatermark>;
    delete(watermarkId: string): Promise<void>;
}
type StreamUpdateVideoParams = {
    allowedOrigins?: Array<string>;
    creator?: string;
    maxDurationSeconds?: number;
    meta?: Record<string, string>;
    requireSignedURLs?: boolean;
    scheduledDeletion?: string | null;
    thumbnailTimestampPct?: number;
};
type StreamCaption = {
    generated?: boolean;
    label: string;
    language: string;
    status?: 'ready' | 'inprogress' | 'error';
};
type StreamDownloadStatus = 'ready' | 'inprogress' | 'error';
type StreamDownloadType = 'default' | 'audio';
type StreamDownload = {
    percentComplete: number;
    status: StreamDownloadStatus;
    url?: string;
};
type StreamDownloadGetResponse = {
    audio?: StreamDownload;
    default?: StreamDownload;
};
type StreamWatermarkPosition = 'upperRight' | 'upperLeft' | 'lowerLeft' | 'lowerRight' | 'center';
type StreamWatermark = {
    id: string;
    size: number;
    height: number;
    width: number;
    created: string;
    downloadedFrom: string | null;
    name: string;
    opacity: number;
    padding: number;
    scale: number;
    position: StreamWatermarkPosition;
};
type StreamWatermarkCreateParams = {
    name?: string;
    opacity?: number;
    padding?: number;
    scale?: number;
    position?: StreamWatermarkPosition;
};
type StreamVideosListParams = {
    limit?: number;
    before?: string;
    beforeComp?: StreamPaginationComparison;
    after?: string;
    afterComp?: StreamPaginationComparison;
};
type StreamPaginationComparison = 'eq' | 'gt' | 'gte' | 'lt' | 'lte';
interface StreamError extends Error {
    readonly code: number;
    readonly statusCode: number;
    readonly message: string;
    readonly stack?: string;
}
interface InternalError extends StreamError {
    name: 'InternalError';
}
interface BadRequestError extends StreamError {
    name: 'BadRequestError';
}
interface NotFoundError extends StreamError {
    name: 'NotFoundError';
}
interface ForbiddenError extends StreamError {
    name: 'ForbiddenError';
}
interface RateLimitedError extends StreamError {
    name: 'RateLimitedError';
}
interface QuotaReachedError extends StreamError {
    name: 'QuotaReachedError';
}
interface MaxFileSizeError extends StreamError {
    name: 'MaxFileSizeError';
}
interface InvalidURLError extends StreamError {
    name: 'InvalidURLError';
}
interface AlreadyUploadedError extends StreamError {
    name: 'AlreadyUploadedError';
}
interface TooManyWatermarksError extends StreamError {
    name: 'TooManyWatermarksError';
}
type MarkdownDocument = {
    name: string;
    blob: Blob;
};
type ConversionResponse = {
    id: string;
    name: string;
    mimeType: string;
    format: 'markdown';
    tokens: number;
    data: string;
} | {
    id: string;
    name: string;
    mimeType: string;
    format: 'error';
    error: string;
};
type ImageConversionOptions = {
    descriptionLanguage?: 'en' | 'es' | 'fr' | 'it' | 'pt' | 'de';
};
type EmbeddedImageConversionOptions = ImageConversionOptions & {
    convert?: boolean;
    maxConvertedImages?: number;
};
type ConversionOptions = {
    html?: {
        images?: EmbeddedImageConversionOptions & {
            convertOGImage?: boolean;
        };
        hostname?: string;
        cssSelector?: string;
    };
    docx?: {
        images?: EmbeddedImageConversionOptions;
    };
    image?: ImageConversionOptions;
    pdf?: {
        images?: EmbeddedImageConversionOptions;
        metadata?: boolean;
    };
};
type ConversionRequestOptions = {
    gateway?: GatewayOptions;
    extraHeaders?: object;
    conversionOptions?: ConversionOptions;
};
type SupportedFileFormat = {
    mimeType: string;
    extension: string;
};
declare abstract class ToMarkdownService {
    transform(files: MarkdownDocument[], options?: ConversionRequestOptions): Promise<ConversionResponse[]>;
    transform(files: MarkdownDocument, options?: ConversionRequestOptions): Promise<ConversionResponse>;
    supported(): Promise<SupportedFileFormat[]>;
}
declare namespace TailStream {
    interface Header {
        readonly name: string;
        readonly value: string;
    }
    interface FetchEventInfo {
        readonly type: "fetch";
        readonly method: string;
        readonly url: string;
        readonly cfJson?: object;
        readonly headers: Header[];
    }
    interface JsRpcEventInfo {
        readonly type: "jsrpc";
    }
    interface ScheduledEventInfo {
        readonly type: "scheduled";
        readonly scheduledTime: Date;
        readonly cron: string;
    }
    interface AlarmEventInfo {
        readonly type: "alarm";
        readonly scheduledTime: Date;
    }
    interface QueueEventInfo {
        readonly type: "queue";
        readonly queueName: string;
        readonly batchSize: number;
    }
    interface EmailEventInfo {
        readonly type: "email";
        readonly mailFrom: string;
        readonly rcptTo: string;
        readonly rawSize: number;
    }
    interface TraceEventInfo {
        readonly type: "trace";
        readonly traces: (string | null)[];
    }
    interface HibernatableWebSocketEventInfoMessage {
        readonly type: "message";
    }
    interface HibernatableWebSocketEventInfoError {
        readonly type: "error";
    }
    interface HibernatableWebSocketEventInfoClose {
        readonly type: "close";
        readonly code: number;
        readonly wasClean: boolean;
    }
    interface HibernatableWebSocketEventInfo {
        readonly type: "hibernatableWebSocket";
        readonly info: HibernatableWebSocketEventInfoClose | HibernatableWebSocketEventInfoError | HibernatableWebSocketEventInfoMessage;
    }
    interface CustomEventInfo {
        readonly type: "custom";
    }
    interface FetchResponseInfo {
        readonly type: "fetch";
        readonly statusCode: number;
    }
    interface ConnectEventInfo {
        readonly type: "connect";
    }
    type EventOutcome = "ok" | "canceled" | "exception" | "unknown" | "killSwitch" | "daemonDown" | "exceededCpu" | "exceededMemory" | "loadShed" | "responseStreamDisconnected" | "scriptNotFound" | "internalError" | "exceededWallTime";
    interface ScriptVersion {
        readonly id: string;
        readonly tag?: string;
        readonly message?: string;
    }
    interface TracePreviewInfo {
        readonly id: string;
        readonly slug: string;
        readonly name: string;
    }
    interface Onset {
        readonly type: "onset";
        readonly attributes: Attribute[];
        readonly spanId: string;
        readonly dispatchNamespace?: string;
        readonly entrypoint?: string;
        readonly executionModel: string;
        readonly durableObjectId?: string;
        readonly scriptName?: string;
        readonly scriptTags?: string[];
        readonly scriptVersion?: ScriptVersion;
        readonly preview?: TracePreviewInfo;
        readonly info: FetchEventInfo | ConnectEventInfo | JsRpcEventInfo | ScheduledEventInfo | AlarmEventInfo | QueueEventInfo | EmailEventInfo | TraceEventInfo | HibernatableWebSocketEventInfo | CustomEventInfo;
    }
    interface Outcome {
        readonly type: "outcome";
        readonly outcome: EventOutcome;
        readonly cpuTime: number;
        readonly wallTime: number;
    }
    interface SpanOpen {
        readonly type: "spanOpen";
        readonly name: string;
        readonly spanId: string;
        readonly info?: FetchEventInfo | JsRpcEventInfo | Attributes;
    }
    interface SpanClose {
        readonly type: "spanClose";
        readonly outcome: EventOutcome;
    }
    interface DiagnosticChannelEvent {
        readonly type: "diagnosticChannel";
        readonly channel: string;
        readonly message: any;
    }
    interface Exception {
        readonly type: "exception";
        readonly name: string;
        readonly message: string;
        readonly stack?: string;
    }
    interface Log {
        readonly type: "log";
        readonly level: "debug" | "error" | "info" | "log" | "warn";
        readonly message: object;
    }
    interface DroppedEventsDiagnostic {
        readonly diagnosticsType: "droppedEvents";
        readonly count: number;
    }
    interface StreamDiagnostic {
        readonly type: 'streamDiagnostic';
        readonly diagnostic: DroppedEventsDiagnostic;
    }
    interface Return {
        readonly type: "return";
        readonly info?: FetchResponseInfo;
    }
    interface Attribute {
        readonly name: string;
        readonly value: string | string[] | boolean | boolean[] | number | number[] | bigint | bigint[];
    }
    interface Attributes {
        readonly type: "attributes";
        readonly info: Attribute[];
    }
    type EventType = Onset | Outcome | SpanOpen | SpanClose | DiagnosticChannelEvent | Exception | Log | StreamDiagnostic | Return | Attributes;
    interface SpanContext {
        readonly traceId: string;
        readonly spanId?: string;
        readonly traceFlags?: number;
    }
    interface TailEvent<Event extends EventType> {
        readonly invocationId: string;
        readonly spanContext: SpanContext;
        readonly timestamp: Date;
        readonly sequence: number;
        readonly event: Event;
    }
    type TailEventHandler<Event extends EventType = EventType> = (event: TailEvent<Event>) => void | Promise<void>;
    type TailEventHandlerObject = {
        outcome?: TailEventHandler<Outcome>;
        spanOpen?: TailEventHandler<SpanOpen>;
        spanClose?: TailEventHandler<SpanClose>;
        diagnosticChannel?: TailEventHandler<DiagnosticChannelEvent>;
        exception?: TailEventHandler<Exception>;
        log?: TailEventHandler<Log>;
        return?: TailEventHandler<Return>;
        attributes?: TailEventHandler<Attributes>;
    };
    type TailEventHandlerType = TailEventHandler | TailEventHandlerObject;
}
type VectorizeVectorMetadataValue = string | number | boolean | string[];
type VectorizeVectorMetadata = VectorizeVectorMetadataValue | Record<string, VectorizeVectorMetadataValue>;
type VectorFloatArray = Float32Array | Float64Array;
interface VectorizeError {
    code?: number;
    error: string;
}
type VectorizeVectorMetadataFilterOp = '$eq' | '$ne' | '$lt' | '$lte' | '$gt' | '$gte';
type VectorizeVectorMetadataFilterCollectionOp = '$in' | '$nin';
type VectorizeVectorMetadataFilter = {
    [field: string]: Exclude<VectorizeVectorMetadataValue, string[]> | null | {
        [Op in VectorizeVectorMetadataFilterOp]?: Exclude<VectorizeVectorMetadataValue, string[]> | null;
    } | {
        [Op in VectorizeVectorMetadataFilterCollectionOp]?: Exclude<VectorizeVectorMetadataValue, string[]>[];
    };
};
type VectorizeDistanceMetric = "euclidean" | "cosine" | "dot-product";
type VectorizeMetadataRetrievalLevel = "all" | "indexed" | "none";
interface VectorizeQueryOptions {
    topK?: number;
    namespace?: string;
    returnValues?: boolean;
    returnMetadata?: boolean | VectorizeMetadataRetrievalLevel;
    filter?: VectorizeVectorMetadataFilter;
}
type VectorizeIndexConfig = {
    dimensions: number;
    metric: VectorizeDistanceMetric;
} | {
    preset: string;
};
interface VectorizeIndexDetails {
    readonly id: string;
    name: string;
    description?: string;
    config: VectorizeIndexConfig;
    vectorsCount: number;
}
interface VectorizeIndexInfo {
    vectorCount: number;
    dimensions: number;
    processedUpToDatetime: number;
    processedUpToMutation: number;
}
interface VectorizeVector {
    id: string;
    values: VectorFloatArray | number[];
    namespace?: string;
    metadata?: Record<string, VectorizeVectorMetadata>;
}
type VectorizeMatch = Pick<Partial<VectorizeVector>, "values"> & Omit<VectorizeVector, "values"> & {
    score: number;
};
interface VectorizeMatches {
    matches: VectorizeMatch[];
    count: number;
}
interface VectorizeVectorMutation {
    ids: string[];
    count: number;
}
interface VectorizeAsyncMutation {
    mutationId: string;
}
declare abstract class VectorizeIndex {
    public describe(): Promise<VectorizeIndexDetails>;
    public query(vector: VectorFloatArray | number[], options?: VectorizeQueryOptions): Promise<VectorizeMatches>;
    public insert(vectors: VectorizeVector[]): Promise<VectorizeVectorMutation>;
    public upsert(vectors: VectorizeVector[]): Promise<VectorizeVectorMutation>;
    public deleteByIds(ids: string[]): Promise<VectorizeVectorMutation>;
    public getByIds(ids: string[]): Promise<VectorizeVector[]>;
}
declare abstract class Vectorize {
    public describe(): Promise<VectorizeIndexInfo>;
    public query(vector: VectorFloatArray | number[], options?: VectorizeQueryOptions): Promise<VectorizeMatches>;
    public queryById(vectorId: string, options?: VectorizeQueryOptions): Promise<VectorizeMatches>;
    public insert(vectors: VectorizeVector[]): Promise<VectorizeAsyncMutation>;
    public upsert(vectors: VectorizeVector[]): Promise<VectorizeAsyncMutation>;
    public deleteByIds(ids: string[]): Promise<VectorizeAsyncMutation>;
    public getByIds(ids: string[]): Promise<VectorizeVector[]>;
}
type WorkerVersionMetadata = {
    id: string;
    tag: string;
    timestamp: string;
};
type WebSearchSearchOptions = {
    query: string;
    limit?: number;
};
type WebSearchResult = {
    url: string;
    title: string;
    description?: string;
    lastModifiedDate?: string;
    imageUrl?: string;
    faviconUrl?: string;
};
type WebSearchResponseMetadata = {
    query: string;
    requestId: string;
    latencyMs: number;
};
type WebSearchSearchResponse = {
    items: WebSearchResult[];
    metadata: WebSearchResponseMetadata;
};
declare abstract class WebSearch {
    search(options: WebSearchSearchOptions): Promise<WebSearchSearchResponse>;
}
interface DynamicDispatchLimits {
    cpuMs?: number;
    subRequests?: number;
}
interface DynamicDispatchOptions {
    limits?: DynamicDispatchLimits;
    outbound?: {
        [key: string]: any;
    };
}
interface DispatchNamespace {
    get(name: string, args?: {
        [key: string]: any;
    }, options?: DynamicDispatchOptions): Fetcher;
}
declare module 'cloudflare:workflows' {
    export class NonRetryableError extends Error {
        public constructor(message: string, name?: string);
    }
}
declare abstract class Workflow<PARAMS = unknown> {
    public get(id: string): Promise<WorkflowInstance>;
    public create(options?: WorkflowInstanceCreateOptions<PARAMS>): Promise<WorkflowInstance>;
    public createBatch(batch: WorkflowInstanceCreateOptions<PARAMS>[]): Promise<WorkflowInstance[]>;
}
type WorkflowDurationLabel = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
type WorkflowSleepDuration = `${number} ${WorkflowDurationLabel}${'s' | ''}` | number;
type WorkflowRetentionDuration = WorkflowSleepDuration;
interface WorkflowInstanceCreateOptions<PARAMS = unknown> {
    id?: string;
    params?: PARAMS;
    retention?: {
        successRetention?: WorkflowRetentionDuration;
        errorRetention?: WorkflowRetentionDuration;
    };
}
type InstanceStatus = {
    status: 'queued'
     | 'running' | 'paused' | 'errored' | 'terminated'
     | 'complete' | 'waiting'
     | 'waitingForPause'
     | 'unknown';
    error?: {
        name: string;
        message: string;
    };
    output?: unknown;
};
interface WorkflowError {
    code?: number;
    message: string;
}
interface WorkflowInstanceTerminateOptions {
    rollback?: boolean;
}
interface WorkflowInstanceRestartOptions {
    from?: {
        name: string;
        count?: number;
        type?: 'do' | 'sleep' | 'waitForEvent';
    };
}
declare abstract class WorkflowInstance {
    public id: string;
    public pause(): Promise<void>;
    public resume(): Promise<void>;
    public terminate(options?: WorkflowInstanceTerminateOptions): Promise<void>;
    public restart(options?: WorkflowInstanceRestartOptions): Promise<void>;
    public status(): Promise<InstanceStatus>;
    public sendEvent({ type, payload, }: {
        type: string;
        payload: unknown;
    }): Promise<void>;
}
