import React, { useEffect, useState } from 'react';
import './App.css';
import If from './components/If';
import Menu from './components/Menu';
import ModalForm from './components/ModalForm';
import ChangePassword from './pages/change-password';
import GuiCoreUpdate from './pages/GuiCoreUpdate';
import { awaitObjPath, getProp, log } from './utils';
const $ = window.$;

function App() {
  const [state, setState] = useState({
    visible: false,
    xmo: false,
    loggedin: false,
    user: '',
    showTranslate: false
  });
  const [ModalComp, setModalComp] = useState(null);
  useEffect(() => {
    awaitObjPath($, 'xmo').then(() => {
      let temXmo = $.xmo !== null;
      const username = getProp($.xmo, 'client.user', '');
      log('username', username);
      setState({
        xmo: temXmo,
        loggedin: !!username,
        user: username,
        showTranslate: false,
        visible: true
      });
      initGuiCore();
    }).catch((e) => {
      log('e', e);
    });
  }, []);

  const getSelectedProfile = () => {
    return getProp($, 'config.profileName', '') ? getProp($, 'config.profileName', '') : window.selectedProfile !== undefined ? window.selectedProfile : '';
  };

  const initGuiCore = () => {
    $.xmo.updateGUICore = function (cb) {
      var successCallback = function (data, type) {
        var oldGuiCore = $.gui.core;
        try {
          $.gui.core = data;
          $.xmo.saveStorage();
          console.log('gui core updated');
        } catch (error) {
          console.log('fail to update the GUI core')
          $.gui.core = oldGuiCore;
          $.xmo.saveStorage();
        }
        if (!!cb) {
          cb(type);
        }
      };
      var filename = getSelectedProfile() ? `/dm-${getSelectedProfile()}.json` : 'dm.json';
      $.get(filename, function (data) {
        console.log('XMO updateGUICore loaded file:', filename);
        successCallback(data, filename.replace(/^\//, ''));
      }).fail(function () {
        $.get("/dm.json", function (data) {
          console.log('XMO updateGUICore loaded file: /dm.json');
          successCallback(data, 'dm.json');
        }).fail(function () {
          console.log('XMO updateGUICore can\'t load dm.json file');
          cb();
        });
      });
    };
  };

  const toaster = function (message, time, cb) {
    $('#snackbar').text(message);
    $('#snackbar').addClass('show');
    setTimeout(function () {
      if (!!cb) {
        cb();
      }
    }, time);
  };

  const handleShowTranslate = () => {
    $.each($('[translate]'), function (i, item) {
      if (!state.showTranslate) {
        $(item).attr('old-background', $(item).css('background'));
        $(item).attr('old-color', $(item).css('color'));
        $(item).css('background', 'green');
        $(item).css('color', 'white');
      } else {
        $(item).css('background', $(item).attr('old-background'));
        $(item).css('color', $(item).attr('old-color'));
      }
    });
    setState({
      ...state,
      user: 'aaa',
      showTranslate: !state.showTranslate
    });
  };

  const handleReloadGuiCore = () => {
    localStorage.setItem('guiCore', '');
    $.xmo.updateGUICore(function (type) {
      toaster('Gui core updated ' + (type || '- default dm'), 2500, function () {
        $('#snackbar').removeClass('show');
        toaster('Reloading', 2000, function () {
          window.location.reload();
        });
      });
    });
  };

  const handleDownloadDataModel = () => {
    const user = {
      username: 'internal',
      passwd: ''
    };

    function download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:application/octet-stream;charset=utf-8;base64,' + btoa(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }

    try {
      $.xmo.login(user.username, user.passwd);
      var timeStamp = new Date().getTime();
      var dm = $.xmo.getValuesTree('Device');
      dm.modelVersion = timeStamp;
      var dmJson = JSON.stringify(dm, null, '  ');
      download('dm-' + getSelectedProfile() + '.json', dmJson);
    } catch (error) {
      log('invalid credentials');
    }
  };

  const menuItems = [
    {
      id: 'm-session',
      label: 'Session',
      items: [
        {
          id: 'one-click-login',
          label: 'Login',
          items: [
            {
              id: 'ocl-internal',
              label: 'internal',
              action: () => {
                try {
                  $.xmo.login('internal', '');
                  window.location.reload();
                } catch (error) {
                  
                }
              }
            },
            {
              id: 'ocl-admin',
              label: 'admin'
            }
          ]
        },
        {
          id: 'm-session-expire',
          label: 'Force expire',
          action: () => {
            $.xmo.sessionStartDate = Date.now() - $.xmo.sessionTimeOut * 600000;
          }
        },
        {
          id: 'm-session-never-expire',
          label: 'Never expire',
          action: () => {
              setInterval(() => {
                $.xmo.sessionStartDate = Date.now();
              }, 1000);
          }
        },
        {
          id: 'm-session-logout',
          label: 'Logout',
          action: () => {
            try {
              $.xmo.logout(true);
              window.location.reload();
            } catch (error) {
              
            }
          }
        }
      ]
    },
    {
      id: 'show-translation',
      label: 'Show translation',
      action: handleShowTranslate
    },
    {
      id: 'dm-manager',
      label: 'Data model',
      items: [
        {
          id: 'reload-btn',
          label: 'Reload',
          action: handleReloadGuiCore
        },
        {
          id: 'dm-upload',
          label: 'Upload',
          action: () => {
            setModalComp({
              key: 'chpwd',
              comp: GuiCoreUpdate
            });
          }
        },
        {
          id: 'dm-download',
          label: 'Download',
          action: handleDownloadDataModel
        }
      ]
    },
    {
      id: 'chpwd',
      label: 'Change passwd',
      action: () => {
        setModalComp({
          key: 'chpwd',
          comp: ChangePassword
        });
      }
    }
  ];

  const handleModalClose = () => {
    setModalComp(null);
  };

  return (
    <div className="App xmo-custom-tool">
      <If condition={state.visible}>
        <Menu items={menuItems}></Menu>
      </If>
      <If condition={ModalComp !== null}>
        <ModalForm outSideClick={handleModalClose}>
        { ModalComp ? React.createElement(() => <ModalComp.comp onClose={handleModalClose}></ModalComp.comp>, { key: ModalComp.key }) : null }
        </ModalForm>
        {/* <div className="u-backdrop open">
          <div className="u-modal">
            
          </div>
        </div> */}
      </If>
      
    </div>
  );
}

export default App;
