import { useLocation } from "react-router-dom";
import { Collection } from "../model/collection.model";
import { useState } from "react";
interface CollectionComponentProps {
    onCollectionUpdate: (collection: Collection) => void;
}
const CollectionComponent: React.FC<CollectionComponentProps> = ({onCollectionUpdate}) => {
    const location = useLocation();
    const collection: Collection = location.state.collection as Collection;
    const [collectionName, setCollectionName] = useState<string>(collection.name);
    const [collectionDescription, setCollectionDescription] = useState<string>(collection.description);

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
                <input type="text" className="pas-collection-viewer-name" value={collectionName} onChange={(e) => { handleNameChange(e.target.value) }} />
                <textarea className="pas-collection-viewer-description" rows={8} value={collectionDescription} onChange={(e) => { handleDescriptionChange(e.target.value) }}>
                </textarea>
                <strong>Total APIs: {collection.api.length}</strong>
                <div className="pas-collection-apis-viewer">
                    {collection.api.map((api, index) => (

                        <div key={index} className="pas-collection-api-viewer">
                            <div className={`api-live-container ${api.islive ? 'api-live' : ''}`}>
                                <div></div>
                            </div>
                            <div><strong className={`api-method api-method-${api.method.toLowerCase()}`}>
                                {api.method.toUpperCase()}</strong>
                            </div>
                            &nbsp;

                            <div>{api.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div></>
    )
}

export default CollectionComponent;