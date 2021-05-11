import { FormattedMessage as Msg } from 'react-intl';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import { SearchField, Text, View } from '@adobe/react-spectrum';

const SearchDrawer = (): JSX.Element | null => {
    const intl = useIntl();
    const [currentText, setCurrentText] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const collapse = () => {
        setDrawerOpen(false);
    };

    const expand = () => {
        setDrawerOpen(true);
    };

    return (
        <>
            <div className={ `overlay ${drawerOpen ? null : 'hidden'}` }
                onClick={ collapse }
                onKeyDown={ e => {
                    if (e.key === 'Escape') {
                        collapse();
                    }
                } }
                role="button"
                tabIndex={ -1 }>
            </div>
            <div
                className={ drawerOpen? 'expanded' : 'collapsed' }
                style={{
                }}>
                <SearchField
                    aria-label={ intl.formatMessage({
                        id: 'layout.organize.search.label',
                    }) }
                    onChange={ setCurrentText }
                    onFocus={ expand }
                    placeholder={ intl.formatMessage({
                        id: 'layout.organize.search.placeholder',
                    }) }
                    value={ currentText }
                    width="100%"
                />
                <View isHidden={ !drawerOpen }>
                    <Text>
                        <Msg id="layout.organize.search.drawerLabel"/>
                    </Text>
                </View>

            </div>
            <style jsx>{ `
                div {
                    width: 25vw;
                    position: absolute;
                    padding: 0 0 0 1rem;
                    transition: width 500ms;
                }
                .overlay {
                    width: 100vw;
                    height: 100vh;
                    top: 0;
                    right: 0;
                    background: rgba(0, 0, 0,0.5);
                    z-index: 2;
                }
                .hidden {
                    display: none;
                }
                .expanded {
                    background: white;
                    width: 50vw;
                    transition: width 500ms;
                    height: 100vh;
                    padding: 1rem;
                    position: absolute;
                    top: 0;
                    right: 0;
                    z-index: 3;
                }
                ` }
            </style>
        </>
    );
};

export default SearchDrawer;
