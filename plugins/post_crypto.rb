module Jekyll
    require 'gibberish'

    class PostCrypto < PostFilter
        def post_render(post)
            if post.name.end_with? ".markdown" or post.name.end_with? ".html"
                cipher = Gibberish::AES.new("kinglerhyperthang")
                post.content = cipher.enc(post.content)
            end
        end
    end
end