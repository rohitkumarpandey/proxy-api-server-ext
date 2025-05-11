import { displayName, version } from "../../package.json"
const LandingPageComponent: React.FC<{}> = () => {
    return (
        <div className="landing-page">
            <h1>{displayName}</h1>
            <p>Mock APIs Like Never Before...</p>
            <p style={{ fontWeight: 100 }}>Version: v{version}</p>
        </div>
    );

}

export default LandingPageComponent;