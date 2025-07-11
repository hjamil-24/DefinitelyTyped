import Arborist = require("@npmcli/arborist");

const arb = new Arborist({
    path: "/path/to/package/root",
    registry: "https://registry.npmjs.org",
    "@foo:registry": "https://registry.foo.com/",
    token: "deadbeefcafebad",
    _authToken: "deadbeefcafebad",
    auth: "aXNhYWNzOm5vdCBteSByZWFsIHBhc3N3b3Jk",
    username: "isaacs",
    password: "bm90IG15IHJlYWwgcGFzc3dvcmQ=",
    "//registry.foo.com:token": "blahblahblah",
    "//basic.auth.only.foo.com:_auth": "aXNhYWNzOm5vdCBteSByZWFsIHBhc3N3b3Jk",
    "//registry.foo.com:always-auth": true,
    progress: true,
    formatPackageLock: true,
});

arb.loadActual().then(tree => {
    tree; // $ExpectType Node
    tree.isWorkspace; // $ExpectType boolean
    tree.edgesOut; // $ExpectType Map<string, Edge>
    tree.global; // $ExpectType boolean;
    tree.globalTop; // $ExpectType boolean;
    tree.isLink; // $ExpectType boolean;
    tree.isRoot; // $ExpectType boolean;
    tree.isProjectRoot; // $ExpectType boolean;
    tree.isRegistryDependency; // $ExpectType boolean;
    tree.depth; // $ExpectType number;
    tree.isTop; // $ExpectType boolean;
    tree.top; // $ExpectType Node;
    tree.isFsTop; // $ExpectType boolean;
    tree.fsTop; // $ExpectType Node;
    tree.resolveParent; // $ExpectType Node;
    tree.binPaths; // $ExpectType string[];
    tree.hasInstallScript; // $ExpectType boolean;
    tree.version; // $ExpectType string;
    tree.packageName; // $ExpectType string;
    tree.inDepBundle; // $ExpectType boolean;
    tree.inShrinkwrap; // $ExpectType boolean;
    tree.isInStore; // $ExpectType boolean;
    tree.hasShrinkwrap; // $ExpectType boolean;
    tree.installLinks; // $ExpectType boolean;
    tree.legacyPeerDeps; // $ExpectType boolean;
    tree.tops; // $ExpectType Set<Node>;
    tree.linksIn; // $ExpectType Set<Link>;
    tree.dummy; // $ExpectType boolean;
    tree.overrides; // $ExpectType OverrideSet | undefined;
    for (const edge of tree.edgesOut.values()) {
        if (edge.overrides) {
            edge.overrides.isRoot; // $ExpectType false
            edge.overrides.key; // $ExpectType string
        }
        edge.bundled;
        edge.workspace;
        edge.prod;
        edge.dev;
        edge.optional;
        edge.peer;
        edge.rawSpec;
        edge.detach();
        edge.reload();
        edge.explain(); // $ExpectType Explanation
    }
});

arb.loadVirtual().then(tree => {
    tree; // $ExpectType Node
});

arb.buildIdealTree({}).then(tree => {
    tree; // $ExpectType Node
});

arb.reify({
    save: true,
}).then(() => {});

// root-level
arb.loadActual().then(async tree => {
    // query all production dependencies
    const results = await tree.querySelectorAll(".prod");
    results; // $ExpectType Node[]
});

// iterative
arb.loadActual().then(async tree => {
    // query for the deduped version of react
    const results = await tree.querySelectorAll("#react:not(:deduped)");
    // query the deduped react for git deps
    const deps = await results[0].querySelectorAll(":type(git)");
    deps; // $ExpectType Node[]
});

async function why(spec: string) {
    const tree = await arb.loadActual();
    const nodesSet = tree.inventory.query("packageName", spec);
    const nodes: Arborist.Node[] = [];
    nodesSet.forEach((node) => {
        nodes.push(node);
    });

    const expls = [];
    for (const node of nodes) {
        const { extraneous, dev, optional, devOptional, peer, inBundle, overridden } = node;
        const explRaw = node.explain();
        const expl = explRaw as
            & typeof explRaw
            & (
                | {
                    extraneous: true;
                    dev?: never;
                    optional?: never;
                    devOptional?: never;
                    peer?: never;
                    bundled?: never;
                    overridden?: never;
                }
                | {
                    extraneous?: false;
                    dev: boolean;
                    optional: boolean;
                    devOptional: boolean;
                    peer: boolean;
                    bundled: boolean;
                    overridden: boolean;
                }
            );
        if (extraneous) {
            expl.extraneous = true;
        } else {
            expl.dev = dev;
            expl.optional = optional;
            expl.devOptional = devOptional;
            expl.peer = peer;
            expl.bundled = inBundle;
            expl.overridden = overridden;
        }
        expls.push(expl);
    }
    return expls;
}
why("lodash");
