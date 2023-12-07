import { DynamicNav, useDynamicContext } from "@dynamic-labs/sdk-react";
import { useEffect, useRef, useState } from "react";
import { trpc } from "src/utils/trpc";
import { useOutsideClick } from "@chakra-ui/react";
import { UserProfileMenu } from "@yukilabs/governance-components";
import { useBalanceData } from "src/utils/hooks";
import { useDelegateRegistryDelegation } from "src/wagmi/DelegateRegistry";
import { gql } from "src/gql";
import { useQuery } from "@apollo/client";
import { stringToHex } from "viem";
import { usePageContext } from "./PageContextProvider";
import { navigate } from "vite-plugin-ssr/client/router";
import { useFileUpload } from "src/hooks/useFileUpload";

const AuthorizedUserView = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userExistsError, setUserExistsError] = useState(false);
  const utils = trpc.useContext();

  const [isUserModalOpen, setIsModalOpen] = useState(false);
  const { handleLogOut } = useDynamicContext();
  const { handleUpload } = useFileUpload();
  const { user } = usePageContext();

  const { data: vp } = useQuery(
    gql(`query Vp($voter: String!, $space: String!, $proposal: String) {
      vp(voter: $voter, space: $space, proposal: $proposal) {
        vp
        vp_by_strategy
        vp_state
      }
    }`),
    {
      variables: {
        space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
        voter: user?.address as string,
      },
      skip: !user?.address, // Skip the query if the user address is not available
    },
  );

  const userBalance = useBalanceData(user?.address as `0x${string}`);

  const { data: delegationData } = useDelegateRegistryDelegation({
    address: import.meta.env.VITE_APP_DELEGATION_REGISTRY,
    args: [
      user?.address as `0x${string}`,
      stringToHex(import.meta.env.VITE_APP_SNAPSHOT_SPACE, { size: 32 }),
    ],
    watch: true,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID),
    enabled: user?.address != null,
  });

  const delegatedTo = trpc.delegates.getDelegateByAddress.useQuery({
    address: delegationData ? delegationData.toLowerCase() : "",
  });

  const editUserProfile = trpc.users.editUserProfile.useMutation();

  const isValidAddress = (addr: string) =>
    addr && addr !== "0x0000000000000000000000000000000000000000";

  const address = user?.address?.toLowerCase() || "";

  const delegate = trpc.delegates.getDelegateByAddress.useQuery({ address });

  const delegationStatement = delegate.data?.delegationStatement;

  const checkDelegateStatus =
    delegationStatement?.isKarmaDelegate &&
    !delegationStatement?.isGovernanceDelegate;
  // Effect for handling redirection based on address and specific path
  useEffect(() => {
    const currentPath = window.location.pathname;

    const isOnSpecificPath =
      currentPath.startsWith("/delegates/profile/onboarding/") ||
      currentPath.startsWith("/delegates/profile/edit/");

    if (isOnSpecificPath && !user) {
      navigate(`/`);
    }
  }, [user]);

  // Effect for handling navigation based on delegate status and address validity
  useEffect(() => {
    if (isValidAddress(address) && checkDelegateStatus) {
      navigate(`/delegates/profile/onboarding/${delegationStatement?.id}`);
    }
  }, [address, delegate.data, checkDelegateStatus]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     const hostElements = document.querySelectorAll('.dynamic-shadow-dom');
  //     const firstHostElement = hostElements[0];
  //     if (firstHostElement && firstHostElement.shadowRoot) {
  //       const observer = new MutationObserver((mutations) => {
  //         const evmNetworkControlElement = firstHostElement.shadowRoot?.querySelector('.dynamic-widget-inline-controls__network-picker-main');
  //         if (evmNetworkControlElement) {
  //           evmNetworkControlElement.addEventListener('click', () => {
  //             const hostElements = document.querySelectorAll('.dynamic-shadow-dom');
  //             const lastHostElement = hostElements[hostElements.length - 1];
  //             if (lastHostElement && lastHostElement.shadowRoot) {
  //               const hostElement2 = lastHostElement.shadowRoot.querySelector('.dynamic-shadow-dom-content');
  //               if (hostElement2) {
  //                 const elements = hostElement2.querySelectorAll('div');
  //                 elements.forEach((element) => {
  //                   element.style.transform = 'none';
  //                 });
  //                 setTimeout(() => {
  //                   const hostElement3 = hostElement2.querySelector('.dynamic-widget-inline-controls__network-picker-list');
  //                   if (hostElement3) {
  //                     hostElement3.style.position = 'fixed';
  //                   }
  //                 }, 300);
  //               }
  //             }
  //           });
  //         }
  //       });
  //       const config = { childList: true, subtree: true };
  //       observer.observe(firstHostElement.shadowRoot, config);
  
  //       return () => {
  //         observer.disconnect();
  //         if (firstHostElement.shadowRoot) {
  //           const evmNetworkControlElement = firstHostElement.shadowRoot?.querySelector('.dynamic-widget-inline-controls__network-picker-main');
  //           if (evmNetworkControlElement) {
  //             evmNetworkControlElement.removeEventListener('click');
  //           }
  //         }
  //       };
  //     }
  //   }, 3000);
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     let evmNetworkControlElement;
  //     const hostElements = document.querySelectorAll('.dynamic-shadow-dom');
  //     const firstHostElement = hostElements[0];
  //     if (firstHostElement && firstHostElement.shadowRoot) {
  //       evmNetworkControlElement = firstHostElement.shadowRoot?.querySelector('.dynamic-widget-inline-controls__network-picker-main');
  //       if (evmNetworkControlElement) {
  //         evmNetworkControlElement.addEventListener('click', () => {
  //           console.log("usao")
  //           const hostElements = document.querySelectorAll('.dynamic-shadow-dom');
  //           const lastHostElement = hostElements[hostElements.length - 1];
  //           console.log("elemelastHostElementnts ", lastHostElement)
  //           if (lastHostElement && lastHostElement.shadowRoot) {
  //             const hostElement2 = lastHostElement.shadowRoot.querySelector('.dynamic-shadow-dom-content');
  //             if (hostElement2) {
  //               const elements = hostElement2.querySelectorAll('div');
  //               console.log("elements ", elements)
  //               elements.forEach((element) => {
  //                 element.style.transform = 'none';
  //               });
  //               setTimeout(() => {
  //                 const hostElement3 = hostElement2.querySelector('.dynamic-widget-inline-controls__network-picker-list');
  //                 console.log("hostElement3 ", hostElement3)
  //                 if (hostElement3) {
  //                   hostElement3.style.position = 'fixed';
  //                 }
  //               }, 300);
  //             }
  //           }
  //         });
  //       }
  //     }
  //     return () => {
  //       if (firstHostElement && firstHostElement.shadowRoot && evmNetworkControlElement) {
  //         evmNetworkControlElement.removeEventListener('click');
  //       }
  //     };
  //   }, 3000);
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     let evmNetworkControlElement;
  //     const hostElements = document.querySelectorAll('.dynamic-shadow-dom');
  //     const firstHostElement = hostElements[0];
  //     if (firstHostElement && firstHostElement.shadowRoot) {
  //       evmNetworkControlElement = firstHostElement.shadowRoot?.querySelector('.dynamic-widget-inline-controls__network-picker-main');
  //       if (evmNetworkControlElement) {
  //         evmNetworkControlElement.addEventListener('click', () => {
  //           console.log("usao")
  //           const hostElements = document.querySelectorAll('.dynamic-shadow-dom');
  //           const lastHostElement = hostElements[hostElements.length - 1];
  //           console.log("elemelastHostElementnts ", lastHostElement)
  //           if (lastHostElement && lastHostElement.shadowRoot) {
  //             const hostElement2 = lastHostElement.shadowRoot.querySelector('.dynamic-shadow-dom-content');
  //             if (hostElement2) {
  //               const elements = hostElement2.querySelectorAll('div');
  //               console.log("elements ", elements)
  //               elements.forEach((element) => {
  //                 element.style.transform = 'none';
  //               });
  //               setTimeout(() => {
  //                 const hostElement3 = hostElement2.querySelector('.dynamic-widget-inline-controls__network-picker-list');
  //                 console.log("hostElement3 ", hostElement3)
  //                 if (hostElement3) {
  //                   hostElement3.style.position = 'fixed';
  //                 }
  //               }, 300);
  
  //               // Create a new MutationObserver to watch for changes in the elements
  //               const observer = new MutationObserver((mutations) => {
  //                 // Code to execute when an element changes
  //               });
  //               const config = { attributes: true, childList: true, subtree: true };
  //               elements.forEach((element) => {
  //                 observer.observe(element, config);
  //               });
  
  //               return () => {
  //                 observer.disconnect();
  //               };
  //             }
  //           }
  //         });
  //       }
  //     }
  //     return () => {
  //       if (firstHostElement && firstHostElement.shadowRoot && evmNetworkControlElement) {
  //         evmNetworkControlElement.removeEventListener('click');
  //       }
  //     };
  //   }, 3000);
  // }, []);

  useEffect(() => {
    let evmNetworkControlElement;
    let styleObservers = [];
    let hostElement2Observer;
  
    const handleClick = () => {
      const hostElements = document.querySelectorAll('.dynamic-shadow-dom');
      const lastHostElement = hostElements[hostElements.length - 1];
  
      if (lastHostElement && lastHostElement.shadowRoot) {
        const hostElement2 = lastHostElement.shadowRoot.querySelector('.dynamic-shadow-dom-content');
        if (hostElement2) {
          hostElement2Observer = new MutationObserver((mutations) => {
            requestAnimationFrame(() => {
              const elements = hostElement2.querySelectorAll('div');
              elements.forEach((element) => {
                // if (element.style.transition === "transform 100ms linear 0s" && element.style.opacity === "100ms linear 0s" && element.style.transform === "translateY(0px)") {
                //   console.log('usao element ', element)
                // }
                const styleObserver = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    // if (element.style.transition === "transform 100ms linear 0s" && element.style.opacity === "100ms linear 0s" && element.style.transform === "translateY(0px)") {
                    //   console.log('usao element 2 ', element)
                    // }
                    // console.log('usao mutation ', mutation)
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                      // console.log('usao ', element.style.transform)
                      if (element.style.transform === 'translateY(0px)') {
                        console.log('unison ', element.style)
                        element.style.transform = 'none';
                      }
                    }
                    element.style.transform = 'none';
                    element.style.zIndex = '2';
                  });
                });
  
                styleObserver.observe(element, { attributes: true, attributeFilter: ['style'] });
                styleObservers.push(styleObserver);
              });
            });
            setTimeout(() => {
              const hostElement3 = hostElement2.querySelector('.dynamic-widget-inline-controls__network-picker-list');
              if (hostElement3) {
                hostElement3.style.position = 'fixed';
              }
            }, 300);
          });
  
          const hostElement2Config = { childList: true, subtree: true };
          hostElement2Observer.observe(hostElement2, hostElement2Config);
        }
      }
    };
  
    setTimeout(() => {
      const hostElements = document.querySelectorAll('.dynamic-shadow-dom');
      const firstHostElement = hostElements[0];
  
      if (firstHostElement && firstHostElement.shadowRoot) {
        evmNetworkControlElement = firstHostElement.shadowRoot?.querySelector('.dynamic-widget-inline-controls__network-picker-main');
        if (evmNetworkControlElement) {
          if (!evmNetworkControlElement.hasAttribute('listener')) {
            evmNetworkControlElement.addEventListener('click', handleClick);
            evmNetworkControlElement.setAttribute('listener', 'true');
          }
        }
      }
    }, 1000);
  
    return () => {
      styleObservers.forEach(observer => observer.disconnect());
      if (hostElement2Observer) {
        hostElement2Observer.disconnect();
      }
      if (evmNetworkControlElement) {
        evmNetworkControlElement.removeEventListener('click', handleClick);
        evmNetworkControlElement.removeAttribute('listener');
      }
    };
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     let evmNetworkControlElement;
  //     const hostElements = document.querySelectorAll('.dynamic-shadow-dom');
  //     console.log("hostElements ", hostElements)
  //     const firstHostElement = hostElements[0];
  //     if (firstHostElement && firstHostElement.shadowRoot) {
  //       evmNetworkControlElement = firstHostElement.shadowRoot?.querySelector('.dynamic-widget-inline-controls__network-picker-main');
  //       if (evmNetworkControlElement) {
  //         if (!evmNetworkControlElement.hasAttribute('listener')) {
  //           evmNetworkControlElement.addEventListener('click', () => {
  //             // console.log("usao")
  //             const hostElements = document.querySelectorAll('.dynamic-shadow-dom');
  //             console.log("hostElements 2 ", hostElements)
  //             const lastHostElement = hostElements[hostElements.length - 1];
  //             // console.log("elemelastHostElementnts ", lastHostElement)
  //             if (lastHostElement && lastHostElement.shadowRoot) {
  //               const hostElement2 = lastHostElement.shadowRoot.querySelector('.dynamic-shadow-dom-content');
  //               if (hostElement2) {
  //                 const hostElement2Observer = new MutationObserver((mutations) => {
  //                   setTimeout(() => {
  //                     const elements = hostElement2.querySelectorAll('div');
  //                     console.log("elements ", elements)
  //                     elements.forEach((element) => {
  //                       element.style.transform = 'none';
  //                     });
  //                     setTimeout(() => {
  //                       const hostElement3 = hostElement2.querySelector('.dynamic-widget-inline-controls__network-picker-list');
  //                       console.log("hostElement3 ", hostElement3)
  //                       if (hostElement3) {
  //                         hostElement3.style.position = 'fixed';
  //                       }
  //                     }, 300);
  //                   }, 0);
  //                 });
  //                 const hostElement2Config = { childList: true, subtree: true };
  //                 hostElement2Observer.observe(hostElement2, hostElement2Config);
  
  //                 return () => {
  //                   hostElement2Observer.disconnect();
  //                 };
  //               }
  //             }
  //           });
  //           evmNetworkControlElement.setAttribute('listener', 'true');
  //         }
  //       }
  //     }
  //     return () => {
  //       if (firstHostElement && firstHostElement.shadowRoot && evmNetworkControlElement) {
  //         evmNetworkControlElement.removeEventListener('click');
  //         evmNetworkControlElement.removeAttribute('listener');
  //       }
  //     };
  //   }, 3000);
  // }, []);

  useEffect(() => {
    function handleClick(event: any) {
      const clickedElement = event.target;
      const originalClickedElement =
        event.originalTarget || event.composedPath()[0] || event.target;
      if (
        clickedElement.classList.contains("dynamic-shadow-dom") &&
        ((originalClickedElement.classList.contains(
          "account-control__container",
        ) &&
          originalClickedElement.nodeName === "BUTTON") ||
          (originalClickedElement.classList.contains("typography") &&
            originalClickedElement.nodeName === "P"))
      ) {
        handleAddressClick(event);
      }
    }

    if (navRef.current) {
      navRef.current.addEventListener("click", handleClick);

      return () => {
        navRef.current?.removeEventListener("click", handleClick);
      };
    }
    return () => {
      // intentionally empty cleanup function
    };
  }, []);

  const handleAddressClick = (event: any) => {
    event.preventDefault();
    setIsMenuOpen(!isMenuOpen);
  };

  useOutsideClick({
    ref: navRef,
    handler: () => {
      if (isMenuOpen && !isUserModalOpen) {
        setIsMenuOpen(false);
      }
    },
  });

  const handleDisconnect = () => {
    handleLogOut();
    setIsMenuOpen(false);
  };

  async function handleSave(data: {
    username: string;
    starknetAddress: string;
    profileImage: string | null;
  }): Promise<any> {
    if (!user) {
      return false;
    }
    try {
      const res = await editUserProfile.mutateAsync(
        {
          id: user.id,
          username: data.username !== user?.username ? data.username : null,
          starknetAddress: data.starknetAddress,
          profileImage: data.profileImage,
        },
        {
          onSuccess: () => {
            utils.auth.currentUser.invalidate();
            return true;
          },
          onError: (error) => {
            if (error.message === "Username already exists") {
              setUserExistsError(true);
            }
            return false;
          },
        },
      );
      return res;
    } catch (error) {
      return false;
    }
  }

  return (
    <>
      <div className="user-menu" ref={navRef}>
        <DynamicNav />
        {isMenuOpen ? (
          <>
            <UserProfileMenu
              delegatedTo={
                delegatedTo?.data ? delegatedTo?.data : delegationData
              }
              onDisconnect={handleDisconnect}
              user={user}
              onSave={handleSave}
              vp={vp?.vp?.vp ?? 0}
              userBalance={userBalance}
              onModalStateChange={(isOpen: boolean) => setIsModalOpen(isOpen)}
              handleUpload={handleUpload}
              userExistsError={userExistsError}
              setUsernameErrorFalse={() => setUserExistsError(false)}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default AuthorizedUserView;
