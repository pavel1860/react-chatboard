const { Gitgraph } = require("@gitgraph/react");




export const VersionTree = () => {

    return (
        <div>
            chat2

            <Gitgraph options={{
                orientation: "vertical-reverse",
                // mode: "compact",
            }}>
                {(gitgraph) => {
                    
                    const drawBranch = (branch: any, comp: any) => {
                        const branchComp = comp.branch(branch.name)
                        for (const turn of getBranchTurns(branch.id)){
                            console.log("turn", turn.id)
                            const commit = branchComp.commit({
                                subject: "Add feature",
                                // body: "More details about the feature…",
                                // dotText: "❤️",
                                // tag: "v1.2",
                                // style: {
                                //   // Specific style for this commit
                                // },
                                // onMessageClick(commit) {
                                //     alert(`Commit ${commit.hash} selected`);
                                // },
                                // onClick(commit) {
                                //     alert(`Commit ${commit.hash} selected`);
                                // },
                                // onMouseOver(commit) {
                                //     alert(`Commit ${commit.hash} selected`);
                                // },
                            })
                            if (turn.branches?.length > 0){
                                for (const turnBranch of turn.branches){
                                    console.log("branch", turnBranch.id)
                                    drawBranch(turnBranch, branchComp)
                                }
                            }
                        }
                    }
                    drawBranch(branches[0], gitgraph)
                    

                    // for (const branch of branches){
                    //     const currBranch = gitgraph.branch(branch.name)
                    //     for (const turn of getBranchTurns(branch.id)){
                    //         const commit = currBranch.commit("test")
                    //     }
                    // }
                    // Simulate git commands with Gitgraph API.
                    // const master = gitgraph.branch("master");
                    // master.commit("Initial commit");

                    // const develop = master.branch("develop");
                    // develop.commit("Add TypeScript");

                    // const aFeature = develop.branch("a-feature");
                    // aFeature
                    // .commit("Make it work")
                    // .commit("Make it right")
                    // .commit("Make it fast");

                    // // develop.merge(aFeature);
                    // develop.commit("Prepare v1");

                    // master.merge(develop).tag("v1.0.0");
                }}
                </Gitgraph>
        </div>
    )