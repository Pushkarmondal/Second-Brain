import { Article } from "../icons/Article";
import { Share } from "../icons/Share";
import { Title } from "../icons/Title";
import { X } from "../icons/X";
import { Youtube } from "../icons/Youtube";

export interface CardProps {
      title: string;
      link: string;
      contentType: 'youtube' | 'twitter' | 'article';
}

function getIconByContentType(type: CardProps['contentType']) {
      switch (type) {
            case 'youtube':
                  return <Youtube />;
            case 'twitter':
                  return <X />;
            case 'article':
                  return <Article />;
            default:
                  return null;
      }
}

export function Card({title, link, contentType}: CardProps) {
      return (
            <div className="ml-10 border border-slate-400 shadow-md rounded-md p-10">
                  {/* Top section with Hello world and share icons */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                        <div className="flex items-center gap-5">
                              {/* <Share /> */}
                              <Title />
                              { title}
                        </div>
                        <div className="flex items-center gap-5">
                              <a href={link} target="_blank">
                                    {getIconByContentType(contentType)}
                              </a>
                        </div>
                        </div>

                  {/* Tweet section below */}
                  <div className="w-full ">
                        {/* {contentType === 'youtube' && <iframe width="350" height="300" src="https://www.youtube.com/embed/M8-MgrGTS0g?si=YZ7DZLkS5f8yJxLy" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>} */}
                        {contentType === 'youtube' && (
                              <iframe
                                    width="350"
                                    height="300"
                                    src="https://www.youtube.com/embed/M8-MgrGTS0g?si=YZ7DZLkS5f8yJxLy"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                              ></iframe>
                        )}
                        {contentType === 'twitter' &&
                              <blockquote className="twitter-tweet">
                                    <a href={link.replace("x.com", "twitter.com")}></a>
                                    </blockquote>
                        }
                        {contentType==='article' && (<iframe src={link} width="100%" height="300"></iframe>)}
                  </div>
            </div>
      );
}