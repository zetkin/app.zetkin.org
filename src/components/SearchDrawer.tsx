import { FocusEventHandler } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import { SearchField, Text, View } from '@adobe/react-spectrum';

const SearchDrawer = (): JSX.Element | null => {
    const intl = useIntl();
    const [currentText, setCurrentText] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const collapse:FocusEventHandler<Element> = (e) => {
        e.stopPropagation();
        setDrawerOpen(false);
    };

    const expand:FocusEventHandler<Element> = (e) => {
        e.stopPropagation();
        setDrawerOpen(true);
    };

    return (
        <>
            <div
                className={ `overlay ${drawerOpen ? null : 'hidden'}` }
                onFocus={ collapse } tabIndex={ -1 }>
                <div
                    className={ `drawer ${drawerOpen ? 'expanded' : 'collapsed'}` }>
                    <SearchField
                        aria-label={ intl.formatMessage({
                            id: 'layout.organize.search.label',
                        }) }
                        onChange={ text => {
                            setCurrentText(text);
                            if (!drawerOpen) {
                                setDrawerOpen(true);
                            }
                        } }
                        onFocus={ expand }
                        onKeyUp={ e => {
                            if (e.key === 'Escape') {
                                setDrawerOpen(false);
                            }
                        } }
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
            </div>

            <style jsx>{ `
                div {
                    position: absolute;
                    padding: 0 0 0 1rem;
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
                    width: 0; height: 0;
                }

                .drawer {
                    width: 25vw;
                    transition: width 500ms;
                    top: 1rem;
                    right: 1rem;
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
