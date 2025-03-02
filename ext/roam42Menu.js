// roam42.roam42Menu
(()=>{

  roam42.roam42Menu = {};
  roam42.roam42Menu.tippy = {};

  roam42.roam42Menu.initialize = async ()=> {
    if( window != window.parent ) {
      return; //don't load if in a iframe
    }
		await roam42.roam42Menu.createMenu();

		var trackTopbarUpdate = false;
		document.querySelector('.rm-topbar').addEventListener("DOMNodeInserted", ()=> {
				if(trackTopbarUpdate==false) {
					trackTopbarUpdate = true;
					setTimeout(()=>{		
						var roamTopbar = document.querySelectorAll(".rm-topbar .bp3-popover-wrapper");
						var positionInToolbar = document.querySelector('.rm-topbar .bp3-icon-menu-closed')?.children.length>0 ? 2 : 1;
						var nextIconButton = roamTopbar[ roamTopbar.length-positionInToolbar];
						nextIconButton.insertAdjacentElement('afterend', document.querySelector('#roam42-menu'));
						nextIconButton.insertAdjacentElement('afterend', document.querySelector('#roam42-button-jumptodate'));
						trackTopbarUpdate = false;
					}, 100);
				}
			}, false); //end of event hanlder
  }

	roam42.roam42Menu.createMenu = async ()=>{
    //create menu item
    var menu = document.createElement("div");
        menu.id='roam42-menu';
        menu.className = 'bp3-button bp3-minimal bp3-small bp3-icon-vertical-distribution';
        menu.setAttribute('style','left:2px;');
		var roamTopbar = document.querySelectorAll(".rm-topbar .bp3-popover-wrapper");
		var positionInToolbar = document.querySelector('.rm-topbar .bp3-icon-menu-closed')?.children.length>0 ? 2 : 1;
		var nextIconButton = roamTopbar[ roamTopbar.length-positionInToolbar];
		nextIconButton.insertAdjacentElement('afterend', menu);

    roam42.roam42Menu.tippy = tippy('#roam42-menu', {
      allowHTML: true,
      interactive: true,
      interactiveBorder: 5,
      arrow: false,
      trigger: 'click',
      position: 'auto',
      onShow(instance) {
        setTimeout(async ()=>{
          var elem = document.getElementById(instance.popper.id).firstElementChild;
          if(window.innerWidth < elem.getBoundingClientRect().right ) elem.style.left = '-' + Number(elem.style.width.replace('px','')) + 'px';
          instance.setContent( await roam42.roam42Menu.displayMenu() );
        },50)
      },
      onMount(instance) {
				setTimeout(async ()=>{
					var bck = document.querySelector('#roam42-menu + div .tippy-box');
					try {
						bck.style.width="240px";
						bck.classList.add('bp3-popover');
					} catch(e) {}
					instance.setContent( await roam42.roam42Menu.displayMenu() ); //force content in for sizing
				},50)
      },
    });

    tippy('#roam42-menu', {
      content: `<div class="bp3-popover-content">Roam42 </div>`,
      allowHTML: true,
      arrow: false,
      theme: 'light-border',
    });		
	}

  roam42.roam42Menu.displayMenu = async ()=>{
    let menu = '';
    menu += `<div class="bp3-popover-content"><ul class="bp3-menu">`;

			if( roam42.wB.enabled == true && roam42.wB.getIsEnabled()) {
				menu += `<li class="">
										<a class="bp3-menu-item bp3-popover-dismiss">
											<div class="bp3-text-overflow-ellipsis bp3-fill" onclick="roam42.roam42Menu.tippy[0].hide(); roam42.wB.launch();">
												<div class="bp3-button bp3-minimal bp3-small bp3-icon-control"></div>
												workBench <span style="font-size:7pt"> (${roam42.wB.keyboardShortcut}) </span>
											</div>
										</a>
									</li>`;
			}


    if( roam42.dailyNotesPopup && roam42.dailyNotesPopup.state != undefined && roam42.dailyNotesPopup.state != 'off'  ) {
      menu += `<li class="">
                   <a class="bp3-menu-item bp3-popover-dismiss">
                    <div class="bp3-text-overflow-ellipsis bp3-fill" onclick="roam42.roam42Menu.tippy[0].hide(); roam42.dailyNotesPopup.component.toggleVisible();">
                      <div class="bp3-button bp3-minimal bp3-small bp3-icon-timeline-events"></div>
                      Daily Notes <span style="font-size:7pt">(Alt-Shift-,)</span>
                    </div>
                  </a>
                </li>`;
    }

    if( roam42.typeAhead != undefined ) {
      menu += `<li class="">
                  <a class="bp3-menu-item bp3-popover-dismiss">
                    <div class="bp3-text-overflow-ellipsis bp3-fill" onclick="roam42.roam42Menu.tippy[0].hide(); roam42.typeAhead.typeAheadLookup();">
                      <div class="bp3-button bp3-minimal bp3-small bp3-icon-manual"></div>
                      Dictionary <span style="font-size:7pt">(Alt-Shift-.)
                    </div>
                  </a>
                </li>`;
    }

    if( roam42.privacyMode  != undefined ) {
      menu += `<li class="">
                  <a class="bp3-menu-item bp3-popover-dismiss">
                    <div class="bp3-text-overflow-ellipsis bp3-fill" onclick="roam42.roam42Menu.tippy[0].hide(); roam42.privacyMode.toggle();">
                      <div class="bp3-button bp3-minimal bp3-small bp3-icon-shield  ${roam42.privacyMode.active() ? 'bp3-intent-warning"':''}"></div>
                        Privacy Mode <span style="font-size:7pt">(Alt-Shift-p)</span><br/>
                        <div style="font-size:7pt;position:relative;left:27px;top:-5px;padding-bottom:0px"><em>(Experimental)</em></div>
                    </div>
                  </a>
                </li>`;
    }


    if( roam42.formatConverter  != undefined ) {
      menu += `<hr style="margin:0px; padding:0px">`
      menu += `<li class="">
                  <a class="bp3-menu-item bp3-popover-dismiss">
                    <div class="bp3-text-overflow-ellipsis bp3-fill" onclick="roam42.roam42Menu.tippy[0].hide(); roam42.formatConverterUI.show();">
                      <div class="bp3-button bp3-minimal bp3-small bp3-icon-fork"></div>
                        Converter <span style="font-size:7pt">(Alt-m)</span><br/>
                    </div>
                  </a>
                </li>`;
    }

    if( roam42.formatConverter  != undefined ) {
      menu += `<li class="">
                  <a class="bp3-menu-item bp3-popover-dismiss">
                    <div class="bp3-text-overflow-ellipsis bp3-fill" onclick="roam42.roam42Menu.tippy[0].hide(); roam42.formatConverterUI.htmlview();">
                      <div class="bp3-button bp3-minimal bp3-small bp3-icon-document-share"></div>
                        Web View <span style="font-size:7pt">(Alt-Shift-m)</span><br/>
                    </div>
                  </a>
                </li>`;
    }

    menu += `<hr style="margin:0px; padding:0px">`

    menu += `<li class="">
                <a class="bp3-menu-item bp3-popover-dismiss">
                  <div class="bp3-text-overflow-ellipsis bp3-fill" onclick="roam42.roam42Menu.tippy[0].hide(); roam42.quickRef.component.toggleQuickReference();">
                      <div class="bp3-button bp3-minimal bp3-small bp3-icon-help"></div>
                      Help <span style="font-size:7pt">(Ctrl-Shift-q)</span>
                  </div>
                </a>
              </li>`;

    menu += `<li class="">
                <a class="bp3-menu-item bp3-popover-dismiss">
                  <div class="bp3-text-overflow-ellipsis bp3-fill" onclick="roam42.roam42Menu.tippy[0].hide(); roam42.tutorials.show();">
                      <div class="bp3-button bp3-minimal bp3-small bp3-icon-learning"></div>
                      Tutorials
                  </div>
                </a>
              </li>`;

		menu += `<li class="">
						<a class="bp3-menu-item bp3-popover-dismiss">
							<div class="bp3-text-overflow-ellipsis bp3-fill" onclick="roam42.roam42Menu.tippy[0].hide();roam42.stats.displayGraphStats()">
									<div class="bp3-button bp3-minimal bp3-small bp3-icon-database"></div>
									Graph DB Stats
							</div>
						</a>
					</li>`;

    // TOGGLE features

    menu += `<hr style="margin:0px; padding:0px">`

    menu += `<li style="padding-left:10px;margin-top:5px;"><span style="font-size:9pt;">Toggle Features On/Off:</span></li>`

        if( roam42.wB.enabled == true ) {
          menu += `<li class="" style="height:28px">
                <a class="bp3-menu-item bp3-popover-dismiss">
                  <div class="bp3-text-overflow-ellipsis bp3-fill" onclick=" roam42.roam42Menu.tippy[0].hide(); roam42.wB.toggleActiveState()">
                    <span style="font-size:8pt;padding-left:15px">
                      workBench <span style="font-size:7pt">${roam42.wB.getIsEnabled() ? `(Active)` : '(Disabled)'} 
                    </span>
                  </div>
                </a>
              </li>`;
        }

        if( roam42.roamNavigator != undefined ) {
          menu += `<li class="" style="height:28px">
                <a class="bp3-menu-item bp3-popover-dismiss">
                  <div class="bp3-text-overflow-ellipsis bp3-fill" onclick=" roam42.roam42Menu.tippy[0].hide(); roamNavigatorStatusToast()">
                    <span style="font-size:8pt;padding-left:15px">
                      Deep Jump Nav <span style="font-size:7pt">${getRoamNavigator_IsEnabled() ? ' (Active)' : '(Disabled)'  }
                    </span>
                  </div>
                </a>
              </li>`;
        }

        if( roam42.livePreview != undefined && roam42.livePreview.state !='off' ) {
          menu += `<li class="" style="height:25px">
                <a class="bp3-menu-item bp3-popover-dismiss">
                   <div class="bp3-text-overflow-ellipsis bp3-fill" onclick="roam42.roam42Menu.tippy[0].hide(); roam42.livePreview.livePreviewStatusToast()">
                    <span style="font-size:8pt;padding-left:15px">
                       Live Preview <span style="font-size:7pt">${roam42.livePreview.getRoamLivePreviewState() > 0 ? ' (Active)' : '(Inactive)'  }
                    </span>
                  </div>
                </a>
              </li>`;
        }


    menu += `<hr style="margin:0px; margin-top:5px; padding:0px">`;
    menu += `<li  style="padding-left:10px;margin-top:5px"><span style="font-size:7pt;padding-left:15px;cursor:pointer;" onclick="roam42.roam42Menu.tippy[0].hide(); window.roamjs.extension.versioning.switch({id: 'roam42', currentVersion:'${roam42.buildID}'});">
    Roam42 ${roam42.buildID}
            </span></li>`;

    menu += `</ul></div>`

    menu += `
          <div style="position:absolute;bottom:-7px;right:-2px;z-index:1000;">
             <img width="40px" src="${roam42.loader.logo2HC}"></img>
          </div>`


    return menu;
  }

  roam42.roam42Menu.testingReload = ()=>{
    try {
      document.querySelector('#roam42-menu').remove()
      document.querySelector('#roam42-menu-spacer').remove()
    } catch(e) {}
    roam42.loader.addScriptToPage( 'roam42Menu',  roam42.host + 'ext/roam42Menu.js'    )
    setTimeout(()=>{
      roam42.roam42Menu.initialize()
    }, 2000)
  }


})();