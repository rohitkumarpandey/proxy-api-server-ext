import { useLocation } from "react-router-dom";
import { Collection } from "../model/collection.model";
import { useState } from "react";
import { CONSTRAINT } from "../common/constant";
import Button from "./button.component";
interface CollectionComponentProps {
    onCollectionUpdate: (collection: Collection) => void;
    onCollectionDelete: (collectionId: string) => void;
}
const CollectionComponent: React.FC<CollectionComponentProps> = ({ onCollectionUpdate, onCollectionDelete }) => {
    const location = useLocation();
    const collection: Collection = location.state.collection as Collection;
    const [collectionName, setCollectionName] = useState<string>(collection.name);
    const [collectionDescription, setCollectionDescription] = useState<string>(collection.description);
    const liveApis = collection.api.filter((api) => api.islive).length;

    const handleNameChange = (name: string) => {
        setCollectionName(name);
        const updatedCollection = { ...collection, name: name, description: collectionDescription };
        onCollectionUpdate(updatedCollection);
    };
    const handleDescriptionChange = (description: string) => {
        setCollectionDescription(description);
        const updatedCollection = { ...collection, name: collectionName, description: description };
        onCollectionUpdate(updatedCollection);
    };
    return (
        <>
            <div className="pas-collection-viewer">
                <input type="text" className="pas-collection-viewer-name" maxLength={CONSTRAINT.INPUT.COLLECTION.NAME} value={collectionName} onChange={(e) => { handleNameChange(e.target.value) }} />
                <textarea className="pas-collection-viewer-description" maxLength={CONSTRAINT.INPUT.COLLECTION.DESCRIPTION} rows={8} value={collectionDescription} onChange={(e) => { handleDescriptionChange(e.target.value) }}>
                </textarea>
                <div className="apis-status">
                    <span>Live: <strong>{liveApis}</strong>,</span>
                    &nbsp;
                    <span>Total: <strong>{collection.api.length}</strong></span></div>
                <div className="pas-collection-apis-viewer">
                    {collection.api.map((api, index) => (

                        <div key={index} className="pas-collection-api-viewer">
                            <strong>{`${(index + 1)}.`}</strong>
                            <div className={`api-live-container ${api.islive ? 'api-live' : ''}`}>
                                <div></div>
                            </div>
                            <div className="api-method-name">
                                <strong className={`api-method api-method-${api.method.toLowerCase()}`}>
                                    {api.method.toUpperCase()}</strong>
                            </div>
                            &nbsp;

                            <div>{api.name}
                            </div>
                            <div>
                                <strong>{api.url}{api.endpoint}</strong>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pas-collection-delete-btn">
                    <Button label={"Delete Collection"} type="primary" size="lg" handler={() => onCollectionDelete(collection.id)} />
                </div>
            </div>
        </>
    )
}

export default CollectionComponent;